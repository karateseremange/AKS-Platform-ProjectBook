#Requires -Version 5.1
[CmdletBinding()]
param(
    [ValidateSet('LocalCheck', 'ReadOnly')][string] $Mode = 'LocalCheck',
    [string] $PackageRun = 'D:\AKS\ADMIN-006-LOGREAD-PACKAGE\logread-package-gF5KXy',
    [string] $CampaignRoot = 'D:\AKS\ADMIN-006-LOGREAD-READONLY',
    [string] $ClaspPackage = '',
    [string] $Authorization = ''
)
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
if ($Mode -eq 'ReadOnly' -and [string]::IsNullOrWhiteSpace($Authorization)) {
    throw 'Separate read-only authorization required. No Google operation.'
}
if ($Mode -eq 'LocalCheck' -and -not [string]::IsNullOrWhiteSpace($Authorization)) {
    throw 'LocalCheck must not receive an authorization.'
}
$NodeCommand = (Get-Command node -CommandType Application -ErrorAction Stop).Source
& $NodeCommand --test (Join-Path $PSScriptRoot 'check-logread.test.cjs') (Join-Path $PSScriptRoot 'check-d4c.test.cjs')
if ($LASTEXITCODE -ne 0) { throw 'Local checks failed. No Google operation.' }
if ([string]::IsNullOrWhiteSpace($ClaspPackage)) {
    $ClaspCommand = Get-Command clasp -ErrorAction Stop
    $ClaspPackage = Join-Path (Split-Path -Parent $ClaspCommand.Source) 'node_modules\@google\clasp'
}
$EngineArguments = @((Join-Path $PSScriptRoot 'check-logread.cjs'), '--mode', $Mode,
    '--package-run', $PackageRun, '--clasp-package', $ClaspPackage, '--output', $CampaignRoot)
if ($Mode -eq 'ReadOnly') { $EngineArguments += @('--authorization', $Authorization) }
& $NodeCommand @EngineArguments
if ($LASTEXITCODE -ne 0) { throw 'LOG_READ preflight stopped. Preserve evidence. No Google write.' }
