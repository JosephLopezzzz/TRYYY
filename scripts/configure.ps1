Param(
  [ValidateSet('light','dark','system')]
  [string]$Theme = 'light',
  [string]$Primary = '37 99 235',
  [string[]]$EnableModules,
  [string[]]$DisableModules
)
$ErrorActionPreference = "Stop"

function Write-Info($m){ Write-Host "[i] $m" -ForegroundColor Cyan }
function Write-OK($m){ Write-Host "[✓] $m" -ForegroundColor Green }
function Write-Err($m){ Write-Host "[x] $m" -ForegroundColor Red }

try {
  $configPath = Join-Path -Path (Resolve-Path './src/config').Path -ChildPath 'app.config.json'
  if (-not (Test-Path $configPath)) { throw "Config not found at $configPath" }
  $json = Get-Content $configPath -Raw | ConvertFrom-Json

  if ($PSBoundParameters.ContainsKey('Theme')) {
    $json.theme.mode = $Theme
  }
  if ($PSBoundParameters.ContainsKey('Primary')) {
    $json.theme.primary = $Primary
  }
  if ($EnableModules) {
    foreach($m in $EnableModules){ if ($json.modules.PSObject.Properties.Name -contains $m){ $json.modules.$m = $true } }
  }
  if ($DisableModules) {
    foreach($m in $DisableModules){ if ($json.modules.PSObject.Properties.Name -contains $m){ $json.modules.$m = $false } }
  }

  ($json | ConvertTo-Json -Depth 6) | Set-Content $configPath
  Write-OK "Configuration updated."
  Write-Info "Preview:"; Get-Content $configPath
}
catch {
  Write-Err $_.Exception.Message
  Write-Host "Usage examples:" -ForegroundColor Yellow
  Write-Host "  ./scripts/configure.ps1 -Theme dark -Primary '147 51 234'" -ForegroundColor Yellow
  Write-Host "  ./scripts/configure.ps1 -EnableModules reservations,analytics" -ForegroundColor Yellow
  exit 1
}
