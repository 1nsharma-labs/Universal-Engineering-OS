<#
.SYNOPSIS
    Universal-Dev-Hub Hybrid Sync Utility (Local Workstation <-> Self-Hosted Cloud)
#>
param(
    [ValidateSet("status", "push", "pull")]
    [string]$Mode = "status"
)

$CloudHost = $env:CLOUD_HUB_HOST
switch ($Mode) {
    "status" {
        Write-Host "=== Universal-Dev-Hub Hybrid Sync Status ===" -ForegroundColor Cyan
        Write-Host "Local Mode      : ACTIVE (Offline-First)" -ForegroundColor Green
        Write-Host "Self-Hosted Host: $(if ($CloudHost) { $CloudHost } else { 'Not configured (set CLOUD_HUB_HOST)' })"
        Write-Host "Config File     : 00-universal-control-plane/hybrid-sync/hybrid-sync.config.yaml"
    }
    "push" {
        if (-not $CloudHost) { Write-Error "Set `$env:CLOUD_HUB_HOST first."; exit 1 }
        git push origin main
        Write-Host "[OK] Pushed workspace commits to self-hosted Git remote." -ForegroundColor Green
    }
    "pull" {
        git pull origin main
        Write-Host "[OK] Synced latest workspace state from remote." -ForegroundColor Green
    }
}
