#Requires -Version 5.1
[CmdletBinding()]
param(
    [string] $RepositoryRoot = 'D:\AKS\ADMIN-006-MANIFEST-LOCAL\manifest-local-20260907-231710',
    [string] $PreviousPackage = 'D:\AKS\ADMIN-006-LOGREAD-PACKAGE\logread-package-gF5KXy',
    [string] $CampaignRoot = 'D:\AKS\ADMIN-006-LOGREAD-WEBAPP-PACKAGE'
)
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$NodeCommand = (Get-Command node -CommandType Application -ErrorAction Stop).Source
$GitCommand = (Get-Command git -CommandType Application -ErrorAction Stop).Source
$EnginePath = Join-Path $PSScriptRoot 'prepare-logread-webapp.cjs'
$Tests = @(
    (Join-Path $PSScriptRoot 'prepare-logread-webapp.test.cjs')
    (Join-Path $PSScriptRoot 'prepare-logread.test.cjs')
)
foreach ($RequiredPath in @($EnginePath) + $Tests + @(
    (Join-Path $PSScriptRoot 'prepare-logread.cjs'),
    (Join-Path $PSScriptRoot 'prepare-d4b.cjs')
)) {
    if (-not (Test-Path -LiteralPath $RequiredPath -PathType Leaf)) {
        throw "Required sibling file missing: $RequiredPath"
    }
}
& $NodeCommand --test @Tests
if ($LASTEXITCODE -ne 0) { throw 'Local Web App package tests failed. No Google operation.' }
& $NodeCommand $EnginePath --repository $RepositoryRoot --previous-package $PreviousPackage `
    --output $CampaignRoot --git $GitCommand
if ($LASTEXITCODE -ne 0) { throw 'Local Web App package preparation stopped. Preserve evidence; no Google operation.' }
