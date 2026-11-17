name: Bug Report
description: Create a report to help us improve UNIFORGE
labels: ["kind/bug", "triage-needed"]
body:
  - type: markdown
    attributes:
      value: |
        Thanks for taking the time to report an issue in **UNIFORGE (`uniforge-os / Universal-Engineering-OS`)**!
  - type: input
    id: version
    attributes:
      label: UNIFORGE Version
      description: What version of UNIFORGE or @uniforge/plugin-sdk are you running?
      placeholder: e.g. 1.0.0 or devhub.py version output
    validations:
      required: true
  - type: dropdown
    id: component
    attributes:
      label: Affected Component
      options:
        - "devhub CLI (devhub.py / devhub.ps1 / Makefile)"
        - "Studio UI / Web Dashboard"
        - "Orchestrator API (FastAPI / Built-in)"
        - "Monaco LSP / PTY Terminal"
        - "@uniforge/plugin-sdk"
        - "Official Plugin"
        - "Universal Wiki"
        - "UNIFORGE Cloud"
    validations:
      required: true
  - type: textarea
    id: reproduction
    attributes:
      label: Steps to Reproduce
      description: Describe step-by-step how to reproduce the issue.
      placeholder: |
        1. Run 'devhub.py studio'
        2. Open http://localhost:7000
        3. Click on ...
    validations:
      required: true
  - type: textarea
    id: expected
    attributes:
      label: Expected Behavior
      description: What did you expect to happen?
    validations:
      required: true
  - type: textarea
    id: logs
    attributes:
      label: Relevant Logs or Error Output
      description: Paste terminal logs or browser console errors.
      render: shell

