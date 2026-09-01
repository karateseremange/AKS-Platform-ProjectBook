#Requires -Version 5.1
[CmdletBinding()]
param(
    [ValidateSet('LocalCheck', 'Execute', 'Restore')]
    [string] $Mode = 'LocalCheck',
    [string] $B0Run = 'D:\AKS\ADMIN-006-D4B\run-2026-09-01T17-24-50-315Z-98f074',
    [string] $RepositoryRoot = 'C:\AKS-Platform',
    [string] $CampaignRoot = 'D:\AKS\ADMIN-006-D4B-B1',
    [string] $ClaspPackage = '',
    [string] $Authorization = '',
    [string] $Session = ''
)
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
# B1-r1. Default is local-only. Execute/Restore require separate authorization.
$EnginePath = Join-Path $PSScriptRoot 'validate-d4b.cjs'
$TestPath = Join-Path $PSScriptRoot 'validate-d4b.test.cjs'
foreach ($RequiredPath in @($EnginePath, $TestPath, (Join-Path $PSScriptRoot 'prepare-d4b.cjs'))) {
    if (-not (Test-Path -LiteralPath $RequiredPath -PathType Leaf)) {
        throw "Required sibling file missing: $RequiredPath"
    }
}
$NodeCommand = (Get-Command node -CommandType Application -ErrorAction Stop).Source
& $NodeCommand --test $TestPath
$TestExitCode = $LASTEXITCODE
if ($TestExitCode -ne 0) { throw 'B1 local tests failed. No Google operation started.' }
if ([string]::IsNullOrWhiteSpace($ClaspPackage)) {
    $ClaspCommand = Get-Command clasp -ErrorAction Stop
    $ClaspDirectory = Split-Path -Parent $ClaspCommand.Source
    $ClaspPackage = Join-Path $ClaspDirectory 'node_modules\@google\clasp'
}
$EngineArguments = @($EnginePath, '--mode', $Mode, '--b0-run', $B0Run, '--clasp-package', $ClaspPackage)
if ($Mode -ne 'Restore') {
    $GitCommand = (Get-Command git -CommandType Application -ErrorAction Stop).Source
    $EngineArguments += @('--repository', $RepositoryRoot, '--output', $CampaignRoot, '--git', $GitCommand)
}
if ($Mode -ne 'LocalCheck') {
    if ([string]::IsNullOrWhiteSpace($Authorization)) { throw 'Separate B1 authorization required.' }
    $EngineArguments += @('--authorization', $Authorization)
}
if ($Mode -eq 'Restore') {
    if ([string]::IsNullOrWhiteSpace($Session)) { throw 'Original B1 session path required for recovery.' }
    $EngineArguments += @('--session', $Session)
}
& $NodeCommand @EngineArguments
$EngineExitCode = $LASTEXITCODE
if ($EngineExitCode -ne 0) {
    throw "B1 stopped (exit $EngineExitCode). If a push was attempted, inspect the session and use the reviewed recovery procedure."
}
