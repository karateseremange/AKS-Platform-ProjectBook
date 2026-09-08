#Requires -Version 5.1
[CmdletBinding()]
param(
    [ValidateSet('LocalCheck', 'Execute', 'Restore')][string] $Mode = 'LocalCheck',
    [string] $PackageRun = 'D:\AKS\ADMIN-006-LOGREAD-PACKAGE\logread-package-gF5KXy',
    [string] $ReadSession = 'D:\AKS\ADMIN-006-LOGREAD-READONLY\logread-readonly-WW5Uwa',
    [string] $CampaignRoot = 'D:\AKS\ADMIN-006-LOGREAD-EXECUTOR',
    [string] $ClaspPackage = '',
    [string] $Authorization = '',
    [string] $Session = ''
)
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
if ($Mode -ne 'LocalCheck' -and [string]::IsNullOrWhiteSpace($Authorization)) {
    throw 'Separate package-specific execution authorization required. No Google operation.'
}
if ($Mode -eq 'LocalCheck' -and (-not [string]::IsNullOrWhiteSpace($Authorization) -or
    -not [string]::IsNullOrWhiteSpace($Session))) {
    throw 'LocalCheck must not receive an authorization or session.'
}
if ($Mode -eq 'Restore' -and [string]::IsNullOrWhiteSpace($Session)) {
    throw 'Restore requires the exact protected session.'
}
$NodeCommand = (Get-Command node -CommandType Application -ErrorAction Stop).Source
$Tests = @(
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
    (Join-Path $PSScriptRoot 'validate-logread.cjs')
    '--mode'
    $Mode
    '--package-run'
    $PackageRun
    '--read-session'
    $ReadSession
    '--clasp-package'
    $ClaspPackage
)
if ($Mode -eq 'Execute') { $Arguments += @('--output', $CampaignRoot) }
if ($Mode -eq 'Restore') { $Arguments += @('--session', $Session) }
if ($Mode -ne 'LocalCheck') { $Arguments += @('--authorization', $Authorization) }
& $NodeCommand @Arguments
if ($LASTEXITCODE -ne 0) {
    throw 'LOG_READ executor stopped. Preserve the session and use only the reviewed Restore mode.'
}
