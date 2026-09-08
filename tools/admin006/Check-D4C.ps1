#Requires -Version 5.1
[CmdletBinding()]
param(
    [ValidateSet('LocalCheck', 'ReadOnly')]
    [string] $Mode = 'LocalCheck',
    [string] $B0Run = 'D:\AKS\ADMIN-006-D4B\run-2026-09-01T17-24-50-315Z-98f074',
    [string] $C2Run = 'D:\AKS\ADMIN-006-D4B-C2\local-c2-G8mK7N',
    [string] $ReadSession = 'D:\AKS\ADMIN-006-D4B-C2-READONLY\c2-readonly-kD5yRC',
    [string] $B1Session = 'D:\AKS\ADMIN-006-D4B-C2-B1\b1-c2-vglRNl',
    [string] $C0Run = 'D:\AKS\ADMIN-006-D4C\local-d4c-tV7sHd',
    [string] $CampaignRoot = 'D:\AKS\ADMIN-006-D4C-C1',
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
foreach ($Name in @('check-d4c.cjs', 'check-d4c.test.cjs', 'prepare-d4c.cjs',
    'prepare-d4b.cjs', 'validate-d4b.cjs', 'check-d4b-c2.cjs', 'validate-d4b-c2.cjs')) {
    if (-not (Test-Path -LiteralPath (Join-Path $PSScriptRoot $Name) -PathType Leaf)) {
        throw "Missing file: $Name"
    }
}
$Engine = Join-Path $PSScriptRoot 'check-d4c.cjs'
& $NodeCommand --check $Engine
if ($LASTEXITCODE -ne 0) { throw 'Node syntax check failed. No Google operation.' }
& $NodeCommand --test (Join-Path $PSScriptRoot 'check-d4c.test.cjs')
if ($LASTEXITCODE -ne 0) { throw 'Local tests failed. No Google operation.' }
if ([string]::IsNullOrWhiteSpace($ClaspPackage)) {
    $ClaspCommand = Get-Command clasp -ErrorAction Stop
    $ClaspPackage = Join-Path (Split-Path -Parent $ClaspCommand.Source) 'node_modules\@google\clasp'
}
$EngineArguments = @($Engine, '--mode', $Mode, '--b0-run', $B0Run, '--c2-run', $C2Run,
    '--read-session', $ReadSession, '--b1-session', $B1Session, '--c0-run', $C0Run,
    '--output', $CampaignRoot, '--clasp-package', $ClaspPackage)
if ($Mode -eq 'ReadOnly') { $EngineArguments += @('--authorization', $Authorization) }
& $NodeCommand @EngineArguments
if ($LASTEXITCODE -ne 0) {
    throw 'D4-C C1 stopped. Preserve local evidence. No Google write.'
}
