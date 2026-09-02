#Requires -Version 5.1
[CmdletBinding()]
param(
    [ValidateSet('LocalCheck', 'ReadOnly')]
    [string] $Mode = 'LocalCheck',
    [string] $B0Run = 'D:\AKS\ADMIN-006-D4B\run-2026-09-01T17-24-50-315Z-98f074',
    [string] $C2Run = 'D:\AKS\ADMIN-006-D4B-C2\local-c2-G8mK7N',
    [string] $CampaignRoot = 'D:\AKS\ADMIN-006-D4B-C2-READONLY',
    [string] $ClaspPackage = '',
    [string] $Authorization = ''
)
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$NodeCommand = (Get-Command node -CommandType Application -ErrorAction Stop).Source
$EnginePath = Join-Path $PSScriptRoot 'check-d4b-c2.cjs'
$TestPath = Join-Path $PSScriptRoot 'check-d4b-c2.test.cjs'
foreach ($RequiredPath in @($EnginePath, $TestPath,
    (Join-Path $PSScriptRoot 'prepare-d4b.cjs'), (Join-Path $PSScriptRoot 'validate-d4b.cjs'))) {
    if (-not (Test-Path -LiteralPath $RequiredPath -PathType Leaf)) { throw "Missing file: $RequiredPath" }
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
    '--c2-run', $C2Run, '--clasp-package', $ClaspPackage)
if ($Mode -eq 'ReadOnly') {
    if ([string]::IsNullOrWhiteSpace($Authorization)) { throw 'Read-only authorization required.' }
    $EngineArguments += @('--output', $CampaignRoot, '--authorization', $Authorization)
}
& $NodeCommand @EngineArguments
if ($LASTEXITCODE -ne 0) { throw 'Preflight stopped. No Google write. Preserve the report and snapshots.' }
