#Requires -Version 5.1
[CmdletBinding()]
param(
    [string] $RepositoryRoot = 'D:\AKS\LOGREAD-local-20260903-212416',
    [string] $C1Session = 'D:\AKS\ADMIN-006-D4C-C1\d4c-readonly-RTaB9N',
    [string] $CampaignRoot = 'D:\AKS\ADMIN-006-LOGREAD-PACKAGE'
)
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$NodeCommand = (Get-Command node -CommandType Application -ErrorAction Stop).Source
$GitCommand = (Get-Command git -CommandType Application -ErrorAction Stop).Source
$EnginePath = Join-Path $PSScriptRoot 'prepare-logread.cjs'
$TestsPath = Join-Path $PSScriptRoot 'prepare-logread.test.cjs'
foreach ($RequiredPath in @($EnginePath, $TestsPath, (Join-Path $PSScriptRoot 'prepare-d4b.cjs'))) {
    if (-not (Test-Path -LiteralPath $RequiredPath -PathType Leaf)) {
        throw "Required sibling file missing: $RequiredPath"
    }
}
& $NodeCommand --test $TestsPath
if ($LASTEXITCODE -ne 0) { throw 'Local package tests failed. No Google operation.' }
& $NodeCommand $EnginePath --repository $RepositoryRoot --c1-session $C1Session `
    --output $CampaignRoot --git $GitCommand
if ($LASTEXITCODE -ne 0) { throw 'Local preparation stopped. Preserve evidence; no Google operation.' }
