#Requires -Version 5.1
[CmdletBinding()]
param(
    [string] $RepositoryRoot = 'C:\AKS-Platform',
    [string] $B0Run = 'D:\AKS\ADMIN-006-D4B\run-2026-09-01T17-24-50-315Z-98f074',
    [string] $B1Session = 'D:\AKS\ADMIN-006-D4B-B1\b1-2YMQP2',
    [string] $CampaignRoot = 'D:\AKS\ADMIN-006-D4B-C2'
)
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
# Local reconstruction only. No clasp detection, Google operation or authorization token.
$NodeCommand = (Get-Command node -CommandType Application -ErrorAction Stop).Source
$GitCommand = (Get-Command git -CommandType Application -ErrorAction Stop).Source
$EnginePath = Join-Path $PSScriptRoot 'rebuild-d4b.cjs'
$TestPath = Join-Path $PSScriptRoot 'rebuild-d4b.test.cjs'
foreach ($RequiredPath in @($EnginePath, $TestPath,
    (Join-Path $PSScriptRoot 'prepare-d4b.cjs'), (Join-Path $PSScriptRoot 'validate-d4b.cjs'))) {
    if (-not (Test-Path -LiteralPath $RequiredPath -PathType Leaf)) {
        throw "Required sibling file missing: $RequiredPath"
    }
}
& $NodeCommand --test $TestPath
if ($LASTEXITCODE -ne 0) { throw 'Local reconstruction tests failed. No Google operation.' }
& $NodeCommand $EnginePath --repository $RepositoryRoot --b0-run $B0Run `
    --b1-session $B1Session --output $CampaignRoot --git $GitCommand
if ($LASTEXITCODE -ne 0) { throw 'Local reconstruction stopped. Preserve all prior evidence. No Google operation.' }
