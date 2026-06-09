---
title: "Notifications"
description: "Notification services in distributed backend systems."
date: 2026-03-15
lastUpdated: "2026-06-09"
category: "backend-engineering"
tags:
  - notifications
  - services
draft: false
slug: notifications
author: Donavan Jones
---

# Notifications

Streaming covers events that happen during a request — the user is actively waiting, connected, and watching tokens arrive. Notifications cover everything else: events that happen asynchronously, outside any active request, that the user still needs to know about.

A daily devotional is ready. A long-running study guide finished generating. A reading plan reminder fires at 7am. Someone commented on a shared note. These are not responses to a request — they are events the system needs to push to users on its own schedule.

Getting notifications right means solving two distinct problems: reliably detecting that an event worth notifying about has occurred, and reliably delivering that notification across multiple channels (in-app, push, email) to wherever the user actually is.

*Part of the [Backend Engineering series](/categories/backend-engineering).*

## What Counts as a Notification

Before designing the service, it helps to be precise about what types of events actually need to notify users on this platform:

**System-triggered events** — the backend produces something the user asked for asynchronously. A study guide generation job completed. An audio narration finished rendering. A scheduled reading plan chapter is due.

**User-triggered events** — another user's action is relevant to the current user. A comment on a shared study note. A response to a discussion thread on a passage.

**Time-triggered events** — reminders and scheduled content that fire at a specific time regardless of any immediate user action. Daily devotionals, streak reminders, reading plan check-ins.

Each type has different latency requirements, different delivery channels, and different failure tolerance. A job completion notification should arrive within seconds. A 7am devotional reminder needs to land within a minute of the scheduled time, not a second. A comment reply should feel near-real-time. Designing one system that handles all of these without special-casing each one is the core challenge.

## Notification Service Architecture

The notification service is a standalone microservice that owns three things: the notification event queue, the delivery channel integrations, and the user notification preferences.

No other service delivers notifications directly. When the inference service finishes generating a study guide, it publishes a `job.completed` event to the message queue. When the reading plan service determines a chapter is due, it publishes a `plan.reminder` event. The notification service consumes all of these events and decides what to send, to whom, and over which channel.

This separation matters for two reasons. First, it keeps delivery logic — retry behavior, channel selection, preference checking, deduplication — out of the services that generate events. Second, it means the notification service can be updated, scaled, or replaced without touching any event-producing service.

```
Inference Service ──→ job.completed ──→
Reading Plan Service → plan.reminder ──→  Message Queue → Notification Service
Comment Service ─────→ comment.added ──→
```

## Delivery Channels

The notification service supports three channels, each with different characteristics:

### In-App (WebSocket / SSE)

For users who are currently active in the application, in-app notifications are delivered immediately over a persistent connection. I use WebSockets for this rather than SSE because the connection is long-lived and bidirectional — the client also needs to send acknowledgments and mark notifications as read.

The notification service maintains a map of active user connections. When an event arrives for a user with an open connection, the notification is written directly to that socket. If no connection exists, the notification is persisted to the database and delivered on the user's next session.

```typescript
// On event arrival
const socket = activeConnections.get(userId);
if (socket?.readyState === WebSocket.OPEN) {
  socket.send(JSON.stringify(notification));
  await markDelivered(notification.id, "in_app");
} else {
  await persistForLaterDelivery(notification);
}
```

The tricky part is horizontal scaling. If the notification service runs multiple instances, a user's WebSocket connection lives on one specific instance. An event consumed by instance A cannot be delivered if the user is connected to instance B. I solve this with a Redis pub/sub layer: each instance subscribes to a channel for every user currently connected to it. When any instance receives an event, it publishes to Redis, and only the instance holding the relevant connection delivers it.

```
Event → Instance A → Redis pub/sub → Instance B (has user's socket) → delivery
```

### Push Notifications (Mobile)

For users who are not actively using the app, push notifications reach them on their device. I use a single abstraction that routes to the appropriate platform service:

- **iOS**: Apple Push Notification Service (APNs)
- **Android**: Firebase Cloud Messaging (FCM)

The notification service stores device tokens at registration time, tagged by platform. Push delivery is fire-and-forget at the transport level — APNs and FCM do not guarantee delivery, and feedback on failure is asynchronous. I handle this with a webhook listener that receives delivery receipts from both services and marks tokens as invalid when a device is unregistered.

Push notifications for this platform are intentionally sparse. A user who gets too many push notifications will disable them, and a disabled channel is worse than no channel. I limit push to high-signal events: job completions, direct replies, scheduled reminders the user explicitly configured. Passive informational updates (new content available, feature announcements) stay in-app only.

### Email

Email is the fallback channel and the channel for content that benefits from rich formatting — weekly summaries, reading plan progress reports, study guide digests. I use a transactional email provider (Resend) rather than running my own SMTP infrastructure. Deliverability is a specialist problem; I do not want to solve it.

Email notifications are triggered when:
- A high-priority event has no active in-app connection and push is not available or disabled
- The user has a daily or weekly digest preference configured
- Time-triggered content (daily devotionals) where the user prefers email over push

Emails are queued separately from push and in-app delivery with a longer retry window. A delayed email is acceptable; a duplicate email from an aggressive retry is not. The queue enforces a deduplication window of 24 hours per notification ID per user.

## User Preferences

Every delivery decision runs through a preference check before sending. Users control:

- Which event types trigger notifications
- Which channels each event type uses
- Quiet hours (no push between 10pm and 7am, configurable)
- Digest frequency (immediate, daily summary, weekly summary, off)

Preferences are stored in the notification service's own database and cached in Redis with a short TTL. The preference check is synchronous in the delivery path — if it adds latency, the user's explicitly configured preference is worth that cost.

```typescript
async function shouldDeliver(userId: string, event: NotificationEvent, channel: Channel): Promise<boolean> {
  const prefs = await getPreferences(userId); // Redis-cached
  if (!prefs.channels[channel]) return false;
  if (!prefs.events[event.type]) return false;
  if (channel === "push" && isQuietHours(prefs.quietHours)) return false;
  return true;
}
```

Default preferences are conservative: in-app always on, push on for high-priority events only, email off except for digests. Users opt in to more, not out of everything.

## Reliability and Deduplication

Notifications must be delivered at least once — missing a job completion notification when a user is waiting is a bad experience. But delivering the same notification twice is also bad — duplicate push notifications look broken and erode trust.

I handle this with a two-part strategy:

**At-least-once delivery via the message queue.** Events are consumed with a manual acknowledgment pattern. The notification service does not ack an event until delivery has been attempted (and either succeeded or exhausted retries). If the service crashes mid-processing, the event is requeued and reprocessed. This guarantees every event is attempted, potentially more than once.

**Idempotent delivery via notification IDs.** Every notification has a stable ID derived from the event. Before delivering, the service checks whether a notification with that ID has already been sent to that user on that channel. Duplicate events from the queue produce the same notification ID and are silently dropped at the delivery step.

```
notification_id = hash(event_id + user_id + channel)
```

Together, these give at-least-once event processing with at-most-once notification delivery per channel.

---

*Explore more articles in the [Backend Engineering series](/categories/backend-engineering).*

---

## Retry Behavior

Not every delivery attempt succeeds. Push tokens expire. Email providers have transient errors. The in-app socket drops mid-send.

Retries use exponential backoff with jitter to avoid thundering herd on transient failures:

| Attempt | Delay |
|---|---|
| 1 | Immediate |
| 2 | 30 seconds |
| 3 | 5 minutes |
| 4 | 30 minutes |
| 5 | 2 hours (final) |

After the final attempt, the notification is marked as failed and the failure is logged with the event type, channel, and error reason. Persistent failures on a specific channel (e.g., all push deliveries failing for a user) trigger a channel health check that can automatically disable the channel and switch to a fallback.

## The Notification Inbox

In-app, users have a notification inbox — a list of recent notifications they can review, mark read, or act on. The inbox is a simple append-only table in Postgres:

```sql
CREATE TABLE notifications (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL,
  type        TEXT NOT NULL,
  title       TEXT NOT NULL,
  body        TEXT,
  payload     JSONB,
  read_at     TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at  TIMESTAMPTZ
);
```

Notifications older than 30 days are soft-expired (hidden from the inbox but retained for audit). Hard deletion runs on a 90-day schedule. The `payload` JSONB field carries action data — a deep link to the relevant study note, the completed job's output ID, the passage for a reading plan chapter — so the client can navigate directly from the notification.

Unread count is maintained in Redis and incremented on delivery, decremented on read. This avoids a `COUNT(*)` query on the notifications table every time the client polls for the badge number.

## Time-Triggered Notifications

Reading plan reminders and daily devotionals fire at user-configured times. These are not driven by an event from another service — they are generated by the notification service itself on a schedule.

I use a cron-like scheduler within the notification service that runs every minute and queries for notifications due in the current window:

```sql
SELECT user_id, template_id, scheduled_for, payload
FROM scheduled_notifications
WHERE scheduled_for BETWEEN now() - interval '1 minute' AND now()
  AND status = 'pending';
```

Matched rows are processed into notification events and delivered through the normal pipeline. The row status is updated to `sent` atomically with the delivery attempt to prevent duplicate sends across service restarts.

For the daily devotional specifically — where thousands of users might have 7am configured — the query window is staggered by user ID to spread delivery load over a few minutes rather than spiking all at once at the top of the hour.

## Observability

Notifications are easy to overlook in observability because they are asynchronous — failures are not immediately visible to the user or the engineer. I track:

- **Delivery rate by channel**: what fraction of attempted deliveries succeed
- **Time-to-delivery**: how long between event creation and successful delivery
- **Opt-out rate by event type**: if users frequently disable a notification type, it is a signal the notification is not valuable
- **Retry exhaustion rate**: how often max retries are reached before a successful delivery

A spike in push delivery failures usually means the device token store has gone stale and needs a refresh cycle. A spike in time-to-delivery usually means the queue consumer is backed up. Both are actionable from metrics alone, without needing to dig into logs.

Notifications are infrastructure that users rarely notice when it works and immediately notice when it does not. The goal is to be invisible — reliable enough that users trust the platform will tell them what they need to know, at the right time, through the right channel, exactly once.

---

*[← Back to Backend Engineering series](/categories/backend-engineering)*
