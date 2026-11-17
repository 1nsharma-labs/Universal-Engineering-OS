<#
.SYNOPSIS
    UNIFORGE (uniforge-os / Universal-Engineering-OS) — Windows PowerShell Root Controller
.EXAMPLE
    .\devhub.ps1 init
    .\devhub.ps1 studio
    .\devhub.ps1 validate
    .\devhub.ps1 test
    .\devhub.ps1 wiki -q rust
    .\devhub.ps1 plugin verify
    .\devhub.ps1 marketplace
    .\devhub.ps1 cloud status
#>
param(
    [Parameter(Position=0)]
    [string]$Command = "help",
    [Parameter(ValueFromRemainingArguments=$true)]
    [string[]]$ExtraArgs
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$PythonBin = Get-Command python -ErrorAction SilentlyContinue
if (-not $PythonBin) {
    Write-Host "[ERROR] Python 3.11+ is required to run UNIFORGE devhub.py" -ForegroundColor Red
    exit 1
}

if ($Command -eq "help" -or $Command -eq "-h" -or $Command -eq "--help") {
    Write-Host "======================================================================" -ForegroundColor Cyan
    Write-Host "    UNIFORGE (uniforge-os) — UNIVERSAL ENGINEERING OS CONTROLLER      " -ForegroundColor Cyan
    Write-Host "======================================================================" -ForegroundColor Cyan
    & python "$ScriptDir\devhub.py" --help
    exit $LASTEXITCODE
}

& python "$ScriptDir\devhub.py" $Command @ExtraArgs
exit $LASTEXITCODE
