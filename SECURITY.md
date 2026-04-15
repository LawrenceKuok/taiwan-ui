# Security Policy

## Reporting a Vulnerability

Email **security@taiwan-ui.dev** with a description, reproduction steps, and impact assessment. Do **NOT** open a public GitHub issue.

We aim to:
- Acknowledge within **72 hours**
- Provide a remediation plan within **30 days**
- Coordinate disclosure timing with you

## Supported Versions

| Version | Supported |
|---------|-----------|
| 0.x     | ✅ (current) |

## Scope

In scope:
- This documentation site (taiwan-ui.vercel.app)
- The `@taiwan-ui/react` package
- The `taiwan-ui` CLI
- API routes under `/api/*`
- Validators in `lib/validators/*`

Out of scope:
- Third-party services (Vercel, GitHub) — report to them directly
- Social engineering
- Volumetric DoS

## Security Controls

- HSTS (max-age=63072000; preload)
- Content Security Policy
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Rate limiting on `/api/submit`
- Zero runtime dependencies in component packages
- CI runs `npm audit --audit-level=high` on every PR

## Disclosure Policy

Coordinated disclosure. Once a fix is released, we will publicly credit reporters who wish to be named.
