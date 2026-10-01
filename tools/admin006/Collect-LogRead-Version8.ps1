#Requires -Version 5.1
[CmdletBinding()]
param(
    [ValidateSet('LocalCheck', 'GoogleReadOnly')][string] $Mode = 'LocalCheck',
    [string] $PackageRun = 'D:\AKS\ADMIN-006-LOGREAD-PACKAGE\logread-package-gF5KXy',
    [string] $ReadSession = 'D:\AKS\ADMIN-006-LOGREAD-READONLY\logread-readonly-WW5Uwa',
    [string] $TechnicalSession = 'D:\AKS\ADMIN-006-LOGREAD-EXECUTOR\logread-executor-WunNuE',
    [string] $PriorSession = 'D:\AKS\ADMIN-006-LOGREAD-BROWSER\logread-browser-WAcbCg',
    [string] $V2Session = 'D:\AKS\ADMIN-006-LOGREAD-BROWSER-V2\logread-browser-v2-aMpxLr',
    [string] $V3Session = 'D:\AKS\ADMIN-006-LOGREAD-BROWSER-V3\logread-browser-v3-ljp2HB',
    [string] $V4Session = 'D:\AKS\ADMIN-006-LOGREAD-BROWSER-V4\logread-browser-v4-mjwLOI',
    [string] $CampaignRoot = 'D:\AKS\ADMIN-006-LOGREAD-VERSION8',
    [string] $ClaspPackage = '',
    [string] $Authorization = ''
)
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
if ($Mode -eq 'LocalCheck' -and -not [string]::IsNullOrWhiteSpace($Authorization)) {
    throw 'LocalCheck must not receive an authorization.'
}
if ($Mode -eq 'GoogleReadOnly' -and [string]::IsNullOrWhiteSpace($Authorization)) {
    throw 'Separate version 8 read-only authorization required.'
}
$NodeCommand = (Get-Command node -CommandType Application -ErrorAction Stop).Source
$Tests = @(
    (Join-Path $PSScriptRoot 'collect-logread-version8.test.cjs')
    (Join-Path $PSScriptRoot 'validate-logread-browser-v4.test.cjs')
    (Join-Path $PSScriptRoot 'validate-logread-browser-v3.test.cjs')
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
    (Join-Path $PSScriptRoot 'collect-logread-version8.cjs')
    '--mode', $Mode
    '--package-run', $PackageRun
    '--read-session', $ReadSession
    '--technical-session', $TechnicalSession
    '--prior-session', $PriorSession
    '--v2-session', $V2Session
    '--v3-session', $V3Session
    '--v4-session', $V4Session
    '--clasp-package', $ClaspPackage
)
if ($Mode -eq 'GoogleReadOnly') {
    $Arguments += @('--output', $CampaignRoot, '--authorization', $Authorization)
}
& $NodeCommand @Arguments
if ($LASTEXITCODE -ne 0) { throw 'LOG_READ version 8 read-only collection stopped.' }
