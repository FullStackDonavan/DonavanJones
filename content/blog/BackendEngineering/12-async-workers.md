---
title: "Async Workers"
description: "Asynchronous worker patterns in backend engineering."
date: 2026-03-27
lastUpdated: "2026-06-09"
category: "backend-engineering"
tags:
  - async
  - workers
draft: false
cluster: "backend-engineering"
slug: async-workers
author: Donavan Jones
---

# Async Workers

Every article in this series that describes a job queue, a background pipeline, or a deferred operation is describing something that runs on an async worker. OCR processing runs on workers. Study guide generation runs on workers. Embedding indexing runs on workers. Notification delivery runs on workers. The async worker layer is the infrastructure that all of these sit on top of.

This article covers the worker system itself: how jobs are queued and claimed, how workers are structured, how concurrency is managed, how failures are handled, and how the system scales. It is the substrate under everything that does not happen in the request path.

*Part of the [Backend Engineering series](/categories/backend-engineering).*

## Why Async Workers

The core reason to move work off the request path is that some operations are too slow, too expensive, or too unreliable to run synchronously inside an HTTP request.

**Too slow**: A study guide takes 45–90 seconds to generate. An HTTP request that takes 90 seconds before responding will be killed by proxies, load balancers, and impatient clients. The user cannot stare at a spinner for 90 seconds and feel like the product works.

**Too expensive**: A batch reindex of 125,000 Bible verses consumes significant API quota. Running it in a request means the request holds a connection open while burning through rate-limited resources. An async worker runs it at a controlled pace without tying up a server process.

**Too unreliable**: Downstream services fail. Embedding API calls return 429s. Notification delivery bounces. In the request path, these failures surface directly to the user. In a worker, they are retried automatically with backoff, invisible to the user unless they exhaust all retries.

## The Queue

The job queue is backed by Postgres using a pattern sometimes called "Postgres as a queue." This is a deliberate choice over a dedicated message broker (Redis Streams, RabbitMQ, SQS). The reasoning:

**Atomicity with business data.** When a user saves a study note, I need to both persist the note and enqueue an embedding job — atomically. With Postgres as the queue, both writes happen in the same transaction. Either both succeed or neither does. With a separate broker, a successful note write followed by a failed queue publish leaves the system in an inconsistent state.

**No additional infrastructure.** Postgres is already running. Adding a message broker adds operational complexity, another failure domain, and another system to monitor.

**Sufficient throughput.** Postgres queues handle thousands of jobs per second with proper indexing. This platform does not approach that volume. For high-throughput systems (millions of events per second), a dedicated broker is worth the operational cost. For this use case, it is not.

The jobs table is the queue:

```sql
CREATE TABLE jobs (
  id           TEXT PRIMARY KEY DEFAULT gen_ulid(),
  queue        TEXT NOT NULL,
  payload      JSONB NOT NULL,
  status       TEXT NOT NULL DEFAULT 'pending',
  priority     INTEGER NOT NULL DEFAULT 0,
  attempts     INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 3,
  run_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  started_at   TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  failed_at    TIMESTAMPTZ,
  error        TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_jobs_queue_status_run_at
  ON jobs (queue, status, priority DESC, run_at)
  WHERE status IN ('pending', 'failed');
```

The partial index on `status IN ('pending', 'failed')` is important. The vast majority of rows are `completed` and should never appear in queue polls. Without the partial index, every poll scans completed rows. With it, the index only covers actionable rows.

`run_at` enables scheduled and delayed jobs — a job with `run_at` in the future will not be picked up until that time. This is how the reading plan scheduler and quiet-hours notification delay work without a separate scheduling system.

## Claiming Jobs

Multiple worker processes run simultaneously. They all poll the same queue. The claiming query must be atomic — two workers must never claim the same job.

```sql
UPDATE jobs
SET
  status     = 'running',
  started_at = now(),
  attempts   = attempts + 1
WHERE id = (
  SELECT id FROM jobs
  WHERE queue    = $1
    AND status   IN ('pending', 'failed')
    AND run_at   <= now()
    AND attempts  < max_attempts
  ORDER BY priority DESC, run_at ASC
  FOR UPDATE SKIP LOCKED
  LIMIT 1
)
RETURNING *;
```

`FOR UPDATE SKIP LOCKED` is the concurrency primitive that makes this safe. When a worker executes this query, Postgres locks the selected row for the duration of the update. Other workers hitting the same query simultaneously skip locked rows and select the next unlocked job. No coordination between workers is needed — Postgres handles mutual exclusion.

`priority DESC, run_at ASC` means high-priority jobs are claimed before low-priority ones, and among equal-priority jobs, older jobs are claimed first (FIFO). Priority is used to ensure user-triggered jobs (they are waiting for a result) are processed before background maintenance jobs (they can wait).

## Worker Structure

A worker process is a long-running Node.js process that polls for jobs, processes them, and updates their status. It has a fixed concurrency — the maximum number of jobs it processes simultaneously.

```typescript
class Worker {
  private readonly concurrency: number;
  private running = 0;

  constructor(
    private queue: string,
    private handler: JobHandler,
    options: WorkerOptions = {}
  ) {
    this.concurrency = options.concurrency ?? 5;
  }

  async start() {
    while (true) {
      if (this.running < this.concurrency) {
        const job = await claimJob(this.queue);
        if (job) {
          this.running++;
          this.processJob(job).finally(() => this.running--);
        } else {
          await sleep(POLL_INTERVAL_MS); // back off when queue is empty
        }
      } else {
        await sleep(10); // at concurrency limit, yield briefly
      }
    }
  }

  private async processJob(job: Job) {
    try {
      await this.handler(job);
      await markCompleted(job.id);
    } catch (err) {
      await handleFailure(job, err);
    }
  }
}
```

The concurrency model is important. A worker with `concurrency: 5` processes up to five jobs at the same time. For I/O-bound work (API calls, database queries), this is efficient — while one job awaits an embedding API response, others are being processed. For CPU-bound work, concurrency should be set lower or matched to available cores.

Different job types run on separate worker pools with tuned concurrency:

| Queue | Concurrency | Reason |
|---|---|---|
| `embedding` | 10 | I/O-bound, fast, high throughput needed |
| `inference` | 3 | Expensive API calls, rate limit sensitive |
| `ocr` | 4 | CPU + API mixed, moderate throughput |
| `notification` | 8 | Fast, I/O-bound, latency-sensitive |
| `agent` | 2 | Long-running, high token cost per job |
| `maintenance` | 1 | Background, no urgency |

## Job Handlers

A job handler is a function that accepts a job record and returns a promise. It has no knowledge of queuing, retrying, or worker mechanics — those are the worker's concern. This separation keeps handlers simple and testable.

```typescript
const embeddingHandler: JobHandler = async (job) => {
  const { text, sourceType, sourceId, userId } = job.payload;
  const vector = await embeddingService.embed(text, { source: sourceType });
  await vectorStore.upsert({
    id: sourceId,
    vector,
    payload: { userId, sourceType, sourceId },
  });
};
```

Handlers throw on failure. The worker catches the throw and routes to failure handling. A handler that swallows errors and resolves successfully will mark the job complete even when the underlying operation failed — a subtle bug that causes jobs to silently drop. Handlers must throw on any failure that should trigger a retry.

## Failure Handling and Retries

When a job handler throws, the worker calls `handleFailure`:

```typescript
async function handleFailure(job: Job, error: Error) {
  const isRetryable = job.attempts < job.max_attempts;

  if (isRetryable) {
    const backoff = exponentialBackoff(job.attempts); // 30s, 5m, 30m
    await db.jobs.update(job.id, {
      status:  "failed",
      run_at:  new Date(Date.now() + backoff),
      error:   error.message,
    });
  } else {
    await db.jobs.update(job.id, {
      status:    "dead",
      failed_at: new Date(),
      error:     error.message,
    });
    await alertOnDeadJob(job);
  }
}
```

Failed jobs go back to `status: 'failed'` with a future `run_at` — the claiming query picks them up again once that time passes. This is automatic retry with exponential backoff using the queue's existing infrastructure — no separate retry mechanism needed.

Jobs that exhaust all attempts become `dead`. Dead jobs do not retry. They sit in the table for inspection and manual intervention. A spike in dead jobs is a monitoring alert: something is systematically wrong, not transiently failing.

Backoff delays by attempt:

| Attempt | Delay |
|---|---|
| 1 (first failure) | 30 seconds |
| 2 | 5 minutes |
| 3 (final) | 30 minutes |

For jobs where the error is clearly permanent (invalid payload, content policy rejection, missing required data), handlers can explicitly mark the job dead without retrying:

```typescript
throw new PermanentError("Passage reference not found: " + ref);
// Worker detects PermanentError and marks dead immediately, skipping retries
```

## Dead Letter Queue

Dead jobs accumulate in the main table with `status: 'dead'`. I treat this as a dead letter queue — a holding area for jobs that need human review.

A daily digest reports dead job counts by queue and error message. Most dead jobs fall into a small number of error categories: API key expired, downstream service permanently unavailable, malformed payload from a now-fixed bug. The error message in the job record is usually enough to diagnose the cause and decide whether to replay the job, discard it, or fix the underlying issue and replay.

Dead jobs can be replayed by resetting `status: 'pending'` and `attempts: 0`. This is a manual operation — I deliberately do not auto-replay dead jobs because the reason a job died is usually something that needs fixing before the job is retried at scale.

## Scheduled Jobs

Jobs with `run_at` in the future are scheduled jobs. They sit in the queue unprocessed until their time arrives, then are claimed normally. This handles:

- **Reading plan reminders**: a job per user per scheduled chapter, with `run_at` set to the reminder time
- **Digest emails**: a daily job per user with `run_at` set to their preferred delivery time
- **Consistency audits**: a weekly job with `run_at` set to Sunday midnight
- **Token budget resets**: a daily job per user that resets inference quotas at midnight UTC

Scheduled jobs are inserted at creation time with their future `run_at`. Cancellation is a simple `DELETE` or status update. The scheduler does not need a separate system — it is the same queue, the same workers, the same claiming mechanism.

Recurring jobs are handled by having each job, on completion, insert the next occurrence with the appropriate `run_at`. A reading plan job that runs successfully schedules the next day's chapter. This is simple and observable — the next occurrence always exists in the jobs table and can be inspected or cancelled like any other job.

---

*Explore more articles in the [Backend Engineering series](/categories/backend-engineering).*

---

## Scaling Workers

Workers scale horizontally. Running two worker processes doubles throughput for a given queue. Running ten doubles it again. Worker processes are stateless — each one is identical, and Postgres handles coordination.

I scale workers based on queue depth: the number of pending jobs waiting. A shallow queue means workers are keeping up — no scaling needed. A growing queue means workers are falling behind — add more.

Queue depth is monitored with a simple query:

```sql
SELECT queue, COUNT(*) as pending
FROM jobs
WHERE status = 'pending' AND run_at <= now()
GROUP BY queue;
```

This runs every 30 seconds and feeds the autoscaler decision: if `embedding` queue depth exceeds 500 jobs, spin up two additional embedding workers. If it drops below 50, scale back down. Workers are Docker containers — scaling is a container count adjustment, not a code change.

The practical scaling limit is the downstream service's capacity, not the worker count. Adding more embedding workers does not help if the embedding API rate limit is already saturated. The rate limiter in the embedding service is the actual bottleneck, and more workers just means more workers waiting at the rate limit gate. Understanding the true bottleneck is more useful than simply adding workers when a queue backs up.

## Observability

The jobs table is its own observability surface. At any point I can query:

- How many jobs are pending in each queue
- How many are running right now (long-running jobs are easy to spot)
- Average wait time between enqueue and claim
- Average processing time by job type
- Dead job rate by queue and error message

Beyond the table, workers emit structured logs on job start, completion, and failure. A job that takes significantly longer than its typical processing time is flagged automatically — a study guide job that runs for 10 minutes when the average is 60 seconds is either hung or encountering an unusual input.

Async workers are invisible when they work and highly visible when they do not. The goal is not to make them invisible in monitoring — it is to make failures immediately obvious before users notice. A queue that is silently backing up, workers that are silently hanging, and dead jobs that are silently accumulating are all failures even if no user has complained yet. Monitoring the queue is how you find out first.

---

*[← Back to Backend Engineering series](/categories/backend-engineering)*
