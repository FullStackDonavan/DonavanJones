---
title: "Authentication"
description: "Authentication service design in backend engineering."
date: 2026-03-01
category: "backend-engineering"
tags:
  - authentication
  - services
draft: false
cluster: "backend-engineering"
slug: authentication
author: Donavan Jones
---

# Authentication

Authentication is the first service every request touches and the last one you want to get wrong. A failure here does not just break a feature — it compromises user data, exposes AI spend to abuse, and can destroy trust in the platform overnight.

I built a dedicated authentication service for my Bible study platform early on. This article covers the design decisions behind it: why JWTs, how sessions are managed, how the service integrates with the rest of the backend, and where I hardened security over time.

*Part of the [Backend Engineering series](/categories/backend-engineering).*

## Why a Dedicated Auth Service

In the monolith, authentication was middleware — a few functions that ran before route handlers. Simple and fine for a prototype. As the system split into microservices, I needed every service to be able to verify identity without calling home to a central database on every request.

The solution is a dedicated auth service that issues signed tokens. Every other service validates those tokens locally using a shared public key. The auth service is in the critical path only for login, registration, token refresh, and logout — not for every API call.

This has two benefits. First, it keeps latency low: token validation is a local cryptographic operation, not a network round trip. Second, it keeps the auth service simple and small. A small service with a narrow responsibility is easier to audit, harden, and reason about.

## JWT Structure and Claims

I use JSON Web Tokens (JWTs) as the primary session mechanism. A JWT is a signed, base64-encoded payload that any service can verify without calling the auth service. The token is signed with an RSA private key held exclusively by the auth service; all other services verify using the corresponding public key.

Every access token includes a standard set of claims:

```json
{
  "sub": "user_01HXYZ...",
  "iat": 1717200000,
  "exp": 1717203600,
  "jti": "tok_01HABC...",
  "tier": "pro",
  "roles": ["user"],
  "platform": "web"
}
```

A few design choices worth explaining:

**`sub` is an opaque ID, not an email.** Email addresses change. Using an immutable internal ID as the subject means account updates never invalidate existing tokens.

**`tier` and `roles` are in the token.** Every service needs to know whether a user has access to premium AI features without another network call. Including tier and role claims in the token makes this a local check. The tradeoff is that if a user's tier changes (e.g., they cancel their subscription), their existing token continues to report the old tier until it expires. I accept this with a short access token TTL of 1 hour.

**`jti` is a unique token ID.** This enables server-side revocation when needed. On logout or suspicious activity, the JTI is added to a Redis blocklist. Services check the blocklist as part of token validation. It adds a Redis read to every request but makes revocation possible without waiting for token expiry.

**`platform`** distinguishes web sessions from mobile sessions. Mobile tokens get a longer refresh token TTL (90 days) since mobile users expect to stay logged in. Web sessions are shorter (7 days).

## Token Lifecycle

Access tokens are short-lived (1 hour). Refresh tokens are long-lived (7–90 days depending on platform) and are used only to obtain new access tokens. This is the standard two-token pattern, and the reason for the split is damage containment: if an access token is stolen, it expires quickly. If a refresh token is stolen, the user can revoke it explicitly.

```
Login:
  POST /auth/login { email, password }
  → 200 { accessToken, refreshToken }

Authenticated request:
  GET /api/study-notes
  Authorization: Bearer <accessToken>
  → 200 { ... }

Token refresh:
  POST /auth/refresh { refreshToken }
  → 200 { accessToken, refreshToken (rotated) }

Logout:
  POST /auth/logout { refreshToken }
  → 200 (JTI blocklisted, refresh token invalidated)
```

**Refresh token rotation** is on. Every time a refresh token is used, it is invalidated and a new one is issued. If the same refresh token is ever used twice, it indicates the token was stolen and replayed — the auth service immediately revokes the entire session family and alerts the user.

## Password Handling

Passwords are hashed with `bcrypt` at a cost factor of 12. I chose bcrypt over Argon2 not because it is strictly better (Argon2 is more modern) but because bcrypt has excellent library support and a long track record. The cost factor of 12 gives approximately 200–300ms of hash time on the server, which is slow enough to frustrate brute-force attacks and fast enough that users do not notice on login.

Passwords are never stored in plaintext, never logged, and never included in any API response. The login endpoint returns only tokens.

Password reset uses a short-lived signed token (15 minutes) sent to the user's verified email address. The token is single-use — it is invalidated immediately on use whether the reset succeeds or not.

## OAuth and Social Login

In addition to email/password, I support Google OAuth for one-click login. The flow is standard OAuth 2.0 PKCE:

1. Client requests an authorization URL from the auth service
2. User is redirected to Google's consent screen
3. Google redirects back with an authorization code
4. Auth service exchanges the code for a Google ID token server-side
5. Auth service verifies the ID token, creates or retrieves the user record, and issues its own access/refresh token pair

The platform never touches the user's Google password or Google access token beyond the exchange. After step 5, the session is entirely managed by our auth service — Google is just an identity provider.

New accounts created via OAuth do not have a password set. If a user later wants password login, they go through the password reset flow which sets a password on the existing account.

---

*Explore more articles in the [Backend Engineering series](/categories/backend-engineering).*

---

## Service Integration

Every other service validates tokens using a shared JWT middleware. The middleware:

1. Extracts the Bearer token from the Authorization header
2. Verifies the signature against the auth service's public key (cached in memory, refreshed on rotation)
3. Checks token expiry
4. Checks the JTI against the Redis blocklist
5. Attaches the decoded claims to the request context

If any step fails, the request is rejected with 401 before it reaches any business logic.

The public key is distributed to services at startup via an environment variable. Key rotation (done every 90 days) is coordinated: the auth service publishes the new key to a shared secrets manager, services pick it up on their next deployment, and the old key remains valid for a 24-hour overlap window.

## Rate Limiting on Auth Endpoints

The login and token refresh endpoints are high-value targets for credential stuffing and brute force. I apply layered rate limiting:

- **IP-based**: 10 login attempts per IP per minute, 50 per hour
- **Account-based**: 5 failed attempts per account per 15 minutes before a temporary lockout
- **Global**: if the error rate on `/auth/login` spikes above a threshold, the rate limit tightens across all IPs automatically

Account lockouts do not reveal whether the account exists (the response is identical whether the account is locked or the password is wrong). This prevents user enumeration.

## What Hardened Over Time

The initial implementation was correct but naive in a few places:

**Refresh tokens were stored in localStorage.** This is a common mistake. LocalStorage is accessible to any JavaScript on the page, making it vulnerable to XSS. I moved refresh tokens to `HttpOnly`, `Secure`, `SameSite=Strict` cookies. Access tokens stay in memory (a JavaScript variable) since they are short-lived and the risk is lower.

**No anomaly detection on token use.** Early on, tokens could be used from any location without triggering any signal. I added a lightweight check: if an access token is used from a geographic region that has never been seen for that account, a passive flag is logged. I do not block the request — geolocation is not reliable enough for a hard control — but it feeds into a broader suspicious activity signal.

**Session listing was missing.** Users could not see what devices were logged in. I added a sessions table that tracks active refresh tokens with device metadata (user agent, platform, last seen). Users can view and revoke individual sessions from their account settings.

## The Bottom Line

Authentication is infrastructure, not a feature. It needs to be correct from the start, observable in production, and designed with abuse in mind — not just the happy path.

The patterns here — short-lived access tokens, rotating refresh tokens, local validation, JTI revocation — are not novel. They are standard practice for a reason: they compose well, they fail gracefully, and they give you meaningful controls when something goes wrong.

Build it once, build it right, and let every other service trust it.

---

*[← Back to Backend Engineering series](/categories/backend-engineering)*
