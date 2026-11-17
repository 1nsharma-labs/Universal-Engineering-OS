# UNIFORGE Security Policy

## 1. Supported Versions

The UNIFORGE Control Plane, `@uniforge/plugin-sdk`, official plugins, and UNIFORGE Cloud receive active security patches according to the matrix below:

| Component / Track | Version | Security Support |
| --- | --- | --- |
| Universal Engineering OS Core | `1.x` | Active (Critical/High patches within 48h–7d) |
| `@uniforge/plugin-sdk` | `1.x` | Active |
| Official Plugins (`plugins/*`) | `1.x` | Active |
| Legacy Pre-release | `< 1.0.0` | End of Life |

---

## 2. Security Architecture & Zero-Trust Threat Model

Because UNIFORGE orchestrates polyglot runtimes, Docker sandboxes, interactive PTY terminals, AI agents, and third-party plugins:

1. **Zero-Trust Container Sandboxes**: Untrusted code runs inside ephemeral containers with `--network none`, `--read-only`, `--cap-drop ALL`, `--pids-limit 64`, `--memory 256m`, and UID `65534` (`nobody`).
2. **Capability-Based Plugin Permissions**: Every plugin declares explicit permissions (`network:outbound`, `network:inbound`, `process:exec`, `storage:read`, `storage:write`, `secrets:read`) in `uniforge-plugin.json`. The `@uniforge/plugin-sdk` runtime rejects undeclared capability invocations at runtime.
3. **Multi-Tenant Cloud Isolation**: UNIFORGE Cloud enforces PostgreSQL Row-Level Security (RLS), Kubernetes `NetworkPolicy` isolation, per-tenant `ResourceQuota` ceilings, and short-lived scoped JWT tokens.
4. **Secret Hygiene**: Never commit `.env` files, API tokens, or private keys. Automated CI gates run Gitleaks, Semgrep, and Trivy on every pull request.

---

## 3. Reporting a Vulnerability

**Please DO NOT disclose security vulnerabilities in public GitHub Issues or Discussions.**

Report vulnerabilities confidentially via either channel:
- **GitHub Private Vulnerability Reporting**: Navigate to the repository's **Security -> Advisories -> Report a vulnerability** page.
- **Email**: `security@uniforge.io` (encrypt sensitive proof-of-concept exploits when possible).

### What to Include
- Affected component, version, and deployment mode (Local vs. UNIFORGE Cloud).
- Clear reproduction steps or minimal proof-of-concept.
- Estimated severity (CVSS v3.1 if known) and potential blast radius.

### Response & Disclosure SLA
| Severity | Initial Acknowledgment | Triage & Patch Target |
| --- | --- | --- |
| **Critical (9.0–10.0)** | Within 12 hours | 24–72 hours |
| **High (7.0–8.9)** | Within 24 hours | 7 days |
| **Medium (4.0–6.9)** | Within 48 hours | 30 days |
| **Low (0.1–3.9)** | Within 5 business days | Next minor release |

We practice **Coordinated Vulnerability Disclosure (CVD)** and credit researchers in our release advisories upon request.
