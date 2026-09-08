#Requires -Version 5.1
[CmdletBinding()]
param(
    [ValidateSet('LocalCheck', 'Execute', 'Restore')][string] $Mode = 'LocalCheck',
    [string] $PackageRun = 'D:\AKS\ADMIN-006-LOGREAD-PACKAGE\logread-package-gF5KXy',
    [string] $ReadSession = 'D:\AKS\ADMIN-006-LOGREAD-READONLY\logread-readonly-WW5Uwa',
    [string] $TechnicalSession = 'D:\AKS\ADMIN-006-LOGREAD-EXECUTOR\logread-executor-WunNuE',
    [string] $PriorSession = 'D:\AKS\ADMIN-006-LOGREAD-BROWSER\logread-browser-WAcbCg',
    [string] $CampaignRoot = 'D:\AKS\ADMIN-006-LOGREAD-BROWSER-V2',
    [string] $ClaspPackage = '',
    [string] $Authorization = '',
    [string] $Session = ''
)
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
if ($Mode -ne 'LocalCheck' -and [string]::IsNullOrWhiteSpace($Authorization)) {
    throw 'Separate V2 authorization, including irreversible version creation, required. No Google operation.'
}
if ($Mode -eq 'LocalCheck' -and (-not [string]::IsNullOrWhiteSpace($Authorization) -or
    -not [string]::IsNullOrWhiteSpace($Session))) {
    throw 'LocalCheck must not receive an authorization or session.'
}
if ($Mode -eq 'Restore' -and [string]::IsNullOrWhiteSpace($Session)) {
    throw 'Restore requires the exact protected V2 session.'
}
$NodeCommand = (Get-Command node -CommandType Application -ErrorAction Stop).Source
$Tests = @(
    (Join-Path $PSScriptRoot 'validate-logread-browser-v2.test.cjs')
    (Join-Path $PSScriptRoot 'validate-logread-browser.test.cjs')
    (Join-Path $PSScriptRoot 'validate-logread.test.cjs')
    (Join-Path $PSScriptRoot 'check-logread.test.cjs')
    (Join-Path $PSScriptRoot 'check-d4c.test.cjs')
)
& $NodeCommand --test @Tests
if ($LASTEXITCODE -ne 0) { throw 'Local checks failed. No Google operation.' }
if ([string]::IsNullOrWhiteSpace($ClaspPackage)) {
    $ClaspCommand = Get-Command clasp -ErrorAction Stop
    $ClaspPackage = Join-Path (Split-Path -Parent $ClaspCommand.Source) 'node_modules\@google\clasp'
}
$Arguments = @(
    (Join-Path $PSScriptRoot 'validate-logread-browser-v2.cjs')
    '--mode'
    $Mode
    '--package-run'
    $PackageRun
    '--read-session'
    $ReadSession
    '--technical-session'
    $TechnicalSession
    '--prior-session'
    $PriorSession
    '--clasp-package'
    $ClaspPackage
)
if ($Mode -eq 'Execute') { $Arguments += @('--output', $CampaignRoot) }
if ($Mode -eq 'Restore') { $Arguments += @('--session', $Session) }
if ($Mode -ne 'LocalCheck') { $Arguments += @('--authorization', $Authorization) }
& $NodeCommand @Arguments
if ($LASTEXITCODE -ne 0) {
    throw 'LOG_READ browser V2 stopped. Preserve the session and use only the reviewed V2 Restore mode.'
}
