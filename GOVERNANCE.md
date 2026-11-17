# UNIFORGE Governance Model (`uniforge-os`)

## 1. Mission & Principles

**UNIFORGE (Universal Engineering OS)** is governed as an open, transparent, meritocratic open-source organization under **`uniforge-os`**. Core principles:
- **Open Core Forever**: The Universal Control Plane, Technology Registry, Universal Wiki, and `@uniforge/plugin-sdk` remain Apache-2.0 open source.
- **Technical Meritocracy**: Influence and commit access are earned through sustained, high-quality contributions.
- **Zero Vendor Lock-In**: Local-first workflows and self-hosted deployments always maintain first-class parity with UNIFORGE Cloud.

---

## 2. Organizational Structure & Roles

| Role | Responsibilities | Selection Criteria |
| --- | --- | --- |
| **Community Member** | Uses UNIFORGE, opens issues, contributes Wiki edits, participates in RFC discussions. | Open to everyone. |
| **Contributor** | Submits accepted PRs for code, plugins, tests, or documentation. | >= 1 merged PR under DCO/Apache-2.0. |
| **Module Maintainer** | Reviews PRs, manages issue triage, maintains domain modules (`CODEOWNERS`), cuts patch releases. | Nominated by a Maintainer; approved by lazy consensus of PSC. |
| **Project Steering Committee (PSC)** | Owns roadmap strategy, RFC ratification, security escalations, trademark stewardship, and Marketplace policies. | 3–7 elected senior maintainers serving 2-year staggered terms. |

---

## 3. Decision-Making & RFC Process

### Day-to-Day Decisions
Routine bug fixes, Wiki additions, and minor features follow **Lazy Consensus**: a PR approved by a module `CODEOWNER` with green CI may be merged after review.

### Major Changes (RFCs)
Architectural changes, breaking Plugin SDK contracts, new security boundaries, or multi-tenant Cloud API changes require an **RFC** in `docs/rfcs/`:
1. Copy `docs/rfcs/0000-template.md` to `docs/rfcs/NNNN-short-title.md`.
2. Open a Pull Request tagged `rfc` and announce in GitHub Discussions.
3. Minimum **7-day review window** for standard RFCs (**14 days** for breaking API/SDK changes).
4. Ratification requires **2/3 majority vote** of the PSC with no unresolved security objections.

---

## 4. Release Cadence & Versioning

- **Core Platform & Control Plane**: Semantic Versioning (`MAJOR.MINOR.PATCH`). Monthly minor releases, on-demand security patches.
- **`@uniforge/plugin-sdk`**: Strict SemVer on npm. Breaking changes require a deprecation cycle of at least one minor release.
- **Official Plugins**: Independently versioned and validated against `@uniforge/plugin-sdk` compatibility ranges.

---

## 5. Commercial & Open-Source Boundaries

- Apache-2.0 open-source repositories live under `github.com/uniforge-os/Universal-Engineering-OS`.
- Commercial licensing (`COMMERCIAL_LICENSE.md`), Enterprise Edition features (`ENTERPRISE.md`), and Marketplace revenue sharing (70% developer / 30% platform) fund full-time maintainers and public CI infrastructure without restricting community use of the open-source core.
