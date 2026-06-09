---
title: "Streaming"
description: "Streaming services and their use in backend systems."
date: 2026-03-10
category: "backend-engineering"
tags:
  - streaming
  - services
draft: false
slug: streaming
author: Donavan Jones
---

# Streaming

The first time I wired up LLM inference without streaming, the UX was immediately obvious as a problem. The user submits a question, a spinner runs for 8 seconds, then the full answer appears at once. It feels broken even when it works correctly. The wait is long enough to make users question whether anything is happening.

Streaming fixes the perception problem and, more importantly, fixes the actual experience. Tokens arrive as they are generated. The user sees the response building in real time — which for a 600-word study guide means they are already reading by the time the first paragraph finishes. The time-to-first-token is what users experience as "fast," not time-to-last-token.

This article covers how streaming is implemented across the stack: from the LLM API through the inference service, through the backend API gateway, and into the browser.

*Part of the [Backend Engineering series](/categories/backend-engineering).*

## The Streaming Stack

There are four layers where streaming is relevant:

```
LLM API (Anthropic / OpenAI)
  ↓ server-sent events
Inference Service
  ↓ server-sent events
API Gateway
  ↓ server-sent events
Browser Client
```

Each hop is a streaming connection. Breaking any one of them — buffering a response at any layer before forwarding it — kills the streaming experience. A common mistake is to proxy an SSE stream through a middleware layer that buffers the full response before forwarding. The client sees a spinner until the buffer flushes, which is the exact behavior streaming was supposed to eliminate.

## Server-Sent Events vs WebSockets

Two protocols support real-time server-to-client data: Server-Sent Events (SSE) and WebSockets.

**WebSockets** open a persistent bidirectional channel. Either side can send at any time. They are the right choice when the client also needs to send messages to the server after the connection is established — chat applications, collaborative editing, live document sync.

**Server-Sent Events** are unidirectional: the server streams, the client listens. They run over standard HTTP/1.1 or HTTP/2, reconnect automatically on dropped connections, and work through standard HTTP infrastructure (load balancers, proxies, CDNs) without special configuration.

For LLM streaming, SSE is the right choice. The client sends one request — the prompt — and then listens while the server streams the completion. There is no bidirectional communication during inference. SSE's simplicity and compatibility with standard HTTP tooling make it easier to operate than WebSockets.

The LLM APIs (Anthropic, OpenAI) both use SSE. I use SSE end-to-end so each layer speaks the same protocol. No translation is needed at any hop.

## The SSE Protocol

SSE is simple by design. The server responds with `Content-Type: text/event-stream` and keeps the connection open, writing newline-delimited events:

```
HTTP/1.1 200 OK
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive

data: {"type":"content_block_delta","delta":{"text":"The "}}

data: {"type":"content_block_delta","delta":{"text":"armor "}}

data: {"type":"content_block_delta","delta":{"text":"of God "}}

data: {"type":"message_delta","usage":{"output_tokens":142}}

data: [DONE]
```

Each `data:` line is one event. The client's `EventSource` API (browser built-in) fires an event handler for each one. The connection stays open until the server sends `[DONE]` or closes the connection, or until the client closes it.

Empty lines between events are the delimiter — two consecutive newlines signal the end of one event and the start of the next. This means event data itself must not contain bare newlines, which is why JSON (which can be compacted to a single line) is the standard payload format.

## The Inference Service

The inference service receives a prompt via a standard POST request and responds with an SSE stream. Internally, it calls the upstream LLM API with streaming enabled and pipes the token stream forward.

```typescript
async function streamCompletion(req: Request, res: Response) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders(); // send headers immediately, before first token

  const stream = await anthropic.messages.stream({
    model: "claude-opus-4-8",
    max_tokens: 1024,
    messages: req.body.messages,
  });

  for await (const event of stream) {
    if (event.type === "content_block_delta") {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    }
  }

  const finalMessage = await stream.finalMessage();
  res.write(`data: ${JSON.stringify({ type: "done", usage: finalMessage.usage })}\n\n`);
  res.write("data: [DONE]\n\n");
  res.end();
}
```

Two things worth noting here:

**`res.flushHeaders()` is called before the first token.** Without this, Node.js buffers the response headers until there is body data to send. The client does not see an open connection until the buffer flushes, which means the spinner keeps running until the first token. Flushing headers immediately signals to the client that the request was accepted and streaming has begun — even if there is a 1–2 second delay before the first token while the LLM ramps up.

**The upstream stream is piped directly.** The inference service does not wait for the full completion before forwarding events. Each token event from the LLM API is written to the client response immediately. This keeps the streaming latency minimal — one network hop per token, not a full round-trip.

## Handling Client Disconnects

Clients disconnect mid-stream more often than you might expect: the user navigates away, closes the tab, or hits stop. Without disconnect handling, the inference service keeps the upstream LLM connection open, generating tokens that will never be read and spending API budget on a response nobody will see.

The fix is to detect client disconnects and abort the upstream request:

```typescript
req.on("close", () => {
  stream.controller.abort();
});
```

Node's `req.close` event fires when the client drops the connection. Aborting the stream controller cancels the upstream fetch request, which terminates token generation on the LLM side. This is the correct behavior: stop spending money when there is nobody left to receive the output.

## Streaming Through the API Gateway

The API gateway sits between the client and the inference service. It handles authentication, rate limiting, and routing. It must not buffer the SSE stream.

The gateway proxies the response headers including `Content-Type: text/event-stream` and sets `Transfer-Encoding: chunked` to signal that response length is not known upfront. The critical configuration is disabling response buffering on the proxy layer — most HTTP proxies buffer by default and must be explicitly configured to pass through streaming responses.

In my setup (nginx in front of the Node.js gateway):

```nginx
location /api/completions {
  proxy_pass http://inference_service;
  proxy_buffering off;
  proxy_cache off;
  proxy_read_timeout 120s;
  proxy_set_header Connection '';
  proxy_http_version 1.1;
}
```

`proxy_buffering off` is the essential line. Without it, nginx buffers the full response before forwarding, turning a streaming response into a delayed batch delivery. `proxy_read_timeout 120s` gives long-running completions time to finish without the proxy closing the connection first.

## The Client

The browser's native `EventSource` API handles SSE connections, but it has one significant limitation: it only supports GET requests. Since inference requests carry a prompt body, GET is not appropriate. I use the `fetch` API with a `ReadableStream` instead, which supports POST and streaming:

```typescript
async function streamCompletion(prompt: string, onToken: (text: string) => void) {
  const response = await fetch("/api/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
    body: JSON.stringify({ messages: [{ role: "user", content: prompt }] }),
  });

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n\n");
    buffer = lines.pop() ?? ""; // incomplete final event stays in buffer

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6);
      if (data === "[DONE]") return;

      const event = JSON.parse(data);
      if (event.type === "content_block_delta") {
        onToken(event.delta.text);
      }
    }
  }
}
```

The buffer handling is the part that catches people: chunks from `reader.read()` do not align with SSE event boundaries. A single read may contain multiple events, or a partial event that continues in the next read. The buffer accumulates incoming bytes, splits on the double-newline event delimiter, processes complete events, and holds the incomplete trailing fragment for the next iteration.

---

*Explore more articles in the [Backend Engineering series](/categories/backend-engineering).*

---

## Error Handling Mid-Stream

Standard HTTP error handling — check the status code, parse the error body — does not apply once a streaming response has started. The connection is open with a 200 status before any tokens arrive. If the inference service encounters an error mid-generation (model API error, timeout, output validation failure), it needs to signal that error through the stream itself.

I use a dedicated error event type:

```
data: {"type":"error","code":"upstream_timeout","message":"Model API did not respond in time"}

data: [DONE]
```

The client checks for `type === "error"` events and renders an inline error state rather than appending the error JSON to the response text. The `[DONE]` event always follows to cleanly terminate the stream even on error — this prevents the client from hanging in an open-connection state waiting for more data that will never arrive.

## Streaming and Token Budgets

Streaming does not change the token accounting — you pay for every token generated whether or not the client reads them. What streaming does change is when you can enforce limits.

I enforce a hard token limit server-side by counting tokens as they stream and aborting the upstream connection when the budget is reached:

```typescript
let tokenCount = 0;
const TOKEN_LIMIT = 1024;

for await (const event of stream) {
  if (event.type === "content_block_delta") {
    tokenCount += approximateTokenCount(event.delta.text);
    if (tokenCount > TOKEN_LIMIT) {
      stream.controller.abort();
      res.write(`data: ${JSON.stringify({ type: "limit_reached" })}\n\n`);
      res.write("data: [DONE]\n\n");
      res.end();
      return;
    }
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  }
}
```

The client receives a `limit_reached` event and renders a "response truncated" indicator rather than an abrupt cutoff. This is better UX than silently truncating mid-sentence and lets users know they can request a continuation if needed.

## What Streaming Changes About System Design

Streaming is not just a transport detail — it changes how you think about the request lifecycle. A streaming request is not done when the server sends the last byte; it is done when the client closes the connection. This affects:

- **Timeout configuration**: proxies and load balancers need timeouts set to the maximum expected generation time, not the standard request timeout
- **Connection limits**: a long-running stream holds a connection open; at scale, this requires attention to connection pool sizing
- **Cost tracking**: billing events fire at stream completion, not at request arrival — the accounting pipeline must handle delayed attribution
- **Session affinity**: if the inference service is load-balanced, the stream must stick to the same instance for its full duration (or use stateless streaming proxies)

These are solvable problems. The point is to go in with eyes open: streaming changes the operational profile of a service in ways that do not show up until you are running at real load.

The next article covers notifications — the other side of server-to-client communication, for events that happen outside the request lifecycle entirely.

---

*[← Back to Backend Engineering series](/categories/backend-engineering)*
