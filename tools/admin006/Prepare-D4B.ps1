#Requires -Version 5.1
[CmdletBinding()]
param(
    [ValidateSet('LocalCheck', 'GoogleReadOnly')]
    [string] $Mode = 'LocalCheck',
    [string] $RepositoryRoot = 'C:\AKS-Platform',
    [string] $CampaignRoot = 'D:\AKS\ADMIN-006-D4B',
    [string] $ClaspPackage = ''
)
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# Revision B0-r2. No push, run, deployment or property write is implemented.
$EnginePath = Join-Path $PSScriptRoot 'prepare-d4b.cjs'
$TestPath = Join-Path $PSScriptRoot 'prepare-d4b.test.cjs'
foreach ($RequiredPath in @($EnginePath, $TestPath)) {
    if (-not (Test-Path -LiteralPath $RequiredPath -PathType Leaf)) {
        throw "Required sibling file missing: $RequiredPath"
    }
}
$NodeCommand = (Get-Command node -CommandType Application -ErrorAction Stop).Source
$GitCommand = (Get-Command git -CommandType Application -ErrorAction Stop).Source
& $NodeCommand --test $TestPath
$TestExitCode = $LASTEXITCODE
if ($TestExitCode -ne 0) { throw 'Local engine tests failed. No Google read started.' }

if ([string]::IsNullOrWhiteSpace($ClaspPackage)) {
    $ClaspCommand = Get-Command clasp -ErrorAction Stop
    $ClaspDirectory = Split-Path -Parent $ClaspCommand.Source
    $ClaspPackage = Join-Path $ClaspDirectory 'node_modules\@google\clasp'
}
$NormalizedMode = if ($Mode -eq 'LocalCheck') { 'LocalCheck' } else { 'GoogleReadOnly' }
$EngineArguments = @(
    $EnginePath, '--mode', $NormalizedMode,
    '--repository', $RepositoryRoot,
    '--output', $CampaignRoot,
    '--clasp-package', $ClaspPackage,
    '--git', $GitCommand
)
& $NodeCommand @EngineArguments
$EngineExitCode = $LASTEXITCODE
if ($EngineExitCode -ne 0) {
    throw "B0 stopped (exit $EngineExitCode). No Google write was attempted."
}
