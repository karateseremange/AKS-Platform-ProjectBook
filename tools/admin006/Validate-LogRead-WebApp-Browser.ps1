#Requires -Version 5.1
[CmdletBinding()]
param(
    [ValidateSet('LocalCheck', 'Resume', 'Restore')][string] $Mode = 'LocalCheck',
    [string] $PackageRun = 'D:\AKS\ADMIN-006-LOGREAD-WEBAPP-PACKAGE\logread-webapp-package-arjzvs',
    [string] $Version8Session = 'D:\AKS\ADMIN-006-LOGREAD-VERSION8\logread-version8-6Y0HL6',
    [string] $ReadSession = 'D:\AKS\ADMIN-006-LOGREAD-WEBAPP-READONLY\logread-webapp-readonly-b2U2jL',
    [string] $TechnicalSession = 'D:\AKS\ADMIN-006-LOGREAD-WEBAPP-EXECUTOR\logread-webapp-executor-Sk2Uvw',
    [string] $AttemptSession = 'D:\AKS\ADMIN-006-LOGREAD-WEBAPP-BROWSER\logread-webapp-browser-fcC70e',
    [string] $CampaignRoot = 'D:\AKS\ADMIN-006-LOGREAD-WEBAPP-BROWSER-R2',
    [string] $ClaspPackage = '',
    [string] $Authorization = '',
    [string] $Session = ''
)
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
if ($Mode -ne 'LocalCheck' -and [string]::IsNullOrWhiteSpace($Authorization)) {
    throw 'Separate resume authorization required. No Google operation.'
}
if ($Mode -eq 'LocalCheck' -and (-not [string]::IsNullOrWhiteSpace($Authorization) -or -not [string]::IsNullOrWhiteSpace($Session))) {
    throw 'LocalCheck must not receive an authorization or session.'
}
if ($Mode -eq 'Restore' -and [string]::IsNullOrWhiteSpace($Session)) {
    throw 'Restore requires the exact protected R2 session.'
}
$NodeCommand = (Get-Command node -CommandType Application -ErrorAction Stop).Source
$Tests = @(
    (Join-Path $PSScriptRoot 'validate-logread-webapp-browser.test.cjs')
    (Join-Path $PSScriptRoot 'validate-logread-webapp.test.cjs')
    (Join-Path $PSScriptRoot 'check-logread-webapp.test.cjs')
)
& $NodeCommand --test @Tests
if ($LASTEXITCODE -ne 0) { throw 'Local checks failed. No Google operation.' }
if ([string]::IsNullOrWhiteSpace($ClaspPackage)) {
    $ClaspCommand = Get-Command clasp -ErrorAction Stop
    $ClaspPackage = Join-Path (Split-Path -Parent $ClaspCommand.Source) 'node_modules\@google\clasp'
}
$Arguments = @(
    (Join-Path $PSScriptRoot 'validate-logread-webapp-browser.cjs')
    '--mode'; $Mode
    '--package-run'; $PackageRun
    '--version8-session'; $Version8Session
    '--read-session'; $ReadSession
    '--technical-session'; $TechnicalSession
    '--attempt-session'; $AttemptSession
    '--clasp-package'; $ClaspPackage
)
if ($Mode -eq 'Resume') { $Arguments += @('--output', $CampaignRoot) }
if ($Mode -eq 'Restore') { $Arguments += @('--session', $Session) }
if ($Mode -ne 'LocalCheck') { $Arguments += @('--authorization', $Authorization) }
& $NodeCommand @Arguments
if ($LASTEXITCODE -ne 0) {
    throw 'LOG_READ Web App browser R2 stopped. Preserve the session and use only the reviewed Restore mode.'
}
