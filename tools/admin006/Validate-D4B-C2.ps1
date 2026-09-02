#Requires -Version 5.1
[CmdletBinding()]
param(
    [ValidateSet('LocalCheck', 'Execute', 'Restore')]
    [string] $Mode = 'LocalCheck',
    [string] $B0Run = 'D:\AKS\ADMIN-006-D4B\run-2026-09-01T17-24-50-315Z-98f074',
    [string] $C2Run = 'D:\AKS\ADMIN-006-D4B-C2\local-c2-G8mK7N',
    [string] $ReadSession = 'D:\AKS\ADMIN-006-D4B-C2-READONLY\c2-readonly-kD5yRC',
    [string] $CampaignRoot = 'D:\AKS\ADMIN-006-D4B-C2-B1',
    [string] $ClaspPackage = '',
    [string] $Authorization = '',
    [string] $Session = ''
)
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$NodeCommand = (Get-Command node -CommandType Application -ErrorAction Stop).Source
$EnginePath = Join-Path $PSScriptRoot 'validate-d4b-c2.cjs'
$TestPath = Join-Path $PSScriptRoot 'validate-d4b-c2.test.cjs'
foreach ($Name in @('validate-d4b-c2.cjs', 'validate-d4b-c2.test.cjs',
    'prepare-d4b.cjs', 'validate-d4b.cjs', 'check-d4b-c2.cjs')) {
    if (-not (Test-Path -LiteralPath (Join-Path $PSScriptRoot $Name) -PathType Leaf)) {
        throw "Missing file: $Name"
    }
}
& $NodeCommand --check $EnginePath
if ($LASTEXITCODE -ne 0) { throw 'Node syntax check failed. No Google operation.' }
& $NodeCommand --test $TestPath
if ($LASTEXITCODE -ne 0) { throw 'Local tests failed. No Google operation.' }
if ([string]::IsNullOrWhiteSpace($ClaspPackage)) {
    $ClaspCommand = Get-Command clasp -ErrorAction Stop
    $ClaspPackage = Join-Path (Split-Path -Parent $ClaspCommand.Source) 'node_modules\@google\clasp'
}
$EngineArguments = @($EnginePath, '--mode', $Mode, '--b0-run', $B0Run,
    '--c2-run', $C2Run, '--read-session', $ReadSession, '--clasp-package', $ClaspPackage)
if ($Mode -ne 'LocalCheck') {
    if ([string]::IsNullOrWhiteSpace($Authorization)) { throw 'Separate B1-C2 authorization required.' }
    $EngineArguments += @('--authorization', $Authorization)
    if ($Mode -eq 'Restore') {
        if ([string]::IsNullOrWhiteSpace($Session)) { throw 'Original B1-C2 session required.' }
        $EngineArguments += @('--session', $Session)
    } else {
        $EngineArguments += @('--output', $CampaignRoot)
    }
}
& $NodeCommand @EngineArguments
if ($LASTEXITCODE -ne 0) {
    throw 'B1-C2 stopped. Preserve the session. If a push was attempted, use only the reviewed recovery procedure.'
}
