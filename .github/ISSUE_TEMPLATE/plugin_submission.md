name: Plugin Submission
description: Propose a new plugin for the UNIFORGE Marketplace or Official Plugin Registry
labels: ["kind/plugin", "ecosystem"]
body:
  - type: markdown
    attributes:
      value: |
        Submit a new community or enterprise plugin for the UNIFORGE ecosystem!
  - type: input
    id: plugin-id
    attributes:
      label: Plugin Identifier
      description: Recommended format `@scope/plugin-name` or `uniforge-plugin-name`
      placeholder: e.g. @acme/uniforge-kafka-explorer
    validations:
      required: true
  - type: input
    id: repo-url
    attributes:
      label: Repository URL
      description: Link to your public open-source or commercial plugin repo.
      placeholder: https://github.com/user/my-uniforge-plugin
    validations:
      required: true
  - type: dropdown
    id: license-tier
    attributes:
      label: Plugin License Tier
      options:
        - "Free & Open Source (Apache-2.0 / MIT)"
        - "Commercial / Paid Subscription"
        - "Freemium with Enterprise Tier"
    validations:
      required: true
  - type: textarea
    id: description
    attributes:
      label: Plugin Capabilities & Architecture
      description: List permissions required (`uniforge-plugin.json`) and core studio features added.
    validations:
      required: true

