#Requires -Version 5.1
[CmdletBinding()]
param(
    [ValidateSet("LocalCheck")][string] $Mode = "LocalCheck",
    [string] $PackageRun = "D:\AKS\ADMIN-006-LOGREAD-WEBAPP-PACKAGE\logread-webapp-package-arjzvs",
    [string] $R3Session = "D:\AKS\ADMIN-006-LOGREAD-WEBAPP-BROWSER-R3\logread-webapp-browser-r3-mAKvaa",
    [string] $ReportRoot = "D:\AKS\ADMIN-006-LOGREAD-WEBAPP-R4-LOCALCHECK"
)
Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
if ($env:OS -ne "Windows_NT") { throw "Windows validation requires Windows. No Google operation." }
if ($PSVersionTable.PSVersion.Major -ne 5 -or $PSVersionTable.PSVersion.Minor -ne 1) {
    throw "Use Windows PowerShell 5.1 for this validation. No Google operation."
}
$TaskRoot = [System.IO.Path]::GetFullPath($PSScriptRoot)
$PackageRoot = (Resolve-Path -LiteralPath $PackageRun -ErrorAction Stop).ProviderPath
$ProtectedR3Root = (Resolve-Path -LiteralPath $R3Session -ErrorAction Stop).ProviderPath
$ResolvedReportRoot = [System.IO.Path]::GetFullPath($ReportRoot)
foreach ($ProtectedRoot in @($TaskRoot, $PackageRoot, $ProtectedR3Root)) {
    $ProtectedPrefix = $ProtectedRoot.TrimEnd("\") + "\"
    if ($ResolvedReportRoot.Equals($ProtectedRoot, [System.StringComparison]::OrdinalIgnoreCase) -or $ResolvedReportRoot.StartsWith($ProtectedPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw "Report path is inside a protected input. No Google operation."
    }
}
$HashManifest = Get-Content -LiteralPath (Join-Path $TaskRoot "r4-integrity.json") -Raw | ConvertFrom-Json
foreach ($Item in $HashManifest.files) {
    if ($Item.path -match "(^/|\\|\.\.|:)") { throw "Unsafe integrity path." }
    $IntegrityFile = Join-Path $TaskRoot $Item.path
    $ObservedHash = (Get-FileHash -LiteralPath $IntegrityFile -Algorithm SHA256).Hash.ToLowerInvariant()
    if ($ObservedHash -ne $Item.sha256) { throw "R4 file integrity mismatch. No Google operation." }
}
$NodeCommand = (Get-Command node -CommandType Application -ErrorAction Stop).Source
$NodeVersionText = & $NodeCommand --version
if ($LASTEXITCODE -ne 0 -or $NodeVersionText -notmatch "^v(2[0-9]|[3-9][0-9])\.") { throw "Node 20 or newer is required." }
$RunName = "r4-local-" + (Get-Date -Format "yyyyMMdd-HHmmss") + "-" + [guid]::NewGuid().ToString("N")
$ReportDirectory = Join-Path $ResolvedReportRoot $RunName
New-Item -ItemType Directory -Path $ReportDirectory -ErrorAction Stop | Out-Null
$TranscriptFile = Join-Path $ReportDirectory "tests.tap"
$TestFile = Join-Path $TaskRoot "validate-logread-webapp-browser-r4.test.cjs"
$TestOutput = @(& $NodeCommand --test --test-reporter=tap $TestFile 2>&1)
$TestExitCode = $LASTEXITCODE
$TestOutput | Set-Content -LiteralPath $TranscriptFile -Encoding UTF8
if ($TestExitCode -ne 0) { throw ("Offline tests failed. Preserve: " + $ReportDirectory + ". No Google operation.") }
$EngineFile = Join-Path $TaskRoot "validate-logread-webapp-browser-r4.cjs"
$EngineArguments = @($EngineFile, "--mode", "LocalCheck", "--package-run", $PackageRoot, "--r3-session", $ProtectedR3Root)
$EngineOutput = @(& $NodeCommand @EngineArguments 2>&1)
$EngineExitCode = $LASTEXITCODE
$EngineLog = Join-Path $ReportDirectory "localcheck.txt"
$EngineOutput | Set-Content -LiteralPath $EngineLog -Encoding UTF8
if ($EngineExitCode -ne 0) { throw ("Protected local evidence check failed. Preserve: " + $ReportDirectory + ". No Google operation.") }
$Report = ($EngineOutput -join [Environment]::NewLine) | ConvertFrom-Json
if ($Report.status -ne "LOGREAD_WEBAPP_R4_LOCAL_CHECK_ONLY" -or $Report.googleReadAttempted -or $Report.googleWriteAttempted -or $Report.remoteModeAvailable) {
    throw "Unexpected local report. No Google operation."
}
$Report | Add-Member -NotePropertyName windowsPowerShell -NotePropertyValue $PSVersionTable.PSVersion.ToString()
$Report | Add-Member -NotePropertyName nodeVersion -NotePropertyValue $NodeVersionText
$Report | Add-Member -NotePropertyName testTranscriptSha256 -NotePropertyValue (Get-FileHash -LiteralPath $TranscriptFile -Algorithm SHA256).Hash.ToLowerInvariant()
$Report | Add-Member -NotePropertyName reportDirectory -NotePropertyValue $ReportDirectory
$Report | ConvertTo-Json -Depth 12 | Set-Content -LiteralPath (Join-Path $ReportDirectory "report.json") -Encoding UTF8
$Report | ConvertTo-Json -Depth 12
Write-Host "R4 LocalCheck completed. Remote execution remains unavailable."
