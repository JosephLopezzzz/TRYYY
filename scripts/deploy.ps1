Param(
  [string]$Environment = 'production',
  [string]$OutDir = './build-artifacts',
  [switch]$Zip
)
$ErrorActionPreference = "Stop"

function Write-Info($m){ Write-Host "[i] $m" -ForegroundColor Cyan }
function Write-OK($m){ Write-Host "[✓] $m" -ForegroundColor Green }
function Write-Err($m){ Write-Host "[x] $m" -ForegroundColor Red }

try {
  if (-not (Test-Path '.env')) { throw ".env not found. Create it from .env.example and set secrets." }
  Write-Info "Installing deps..."
  corepack enable | Out-Null
  corepack prepare pnpm@9.6.0 --activate | Out-Null
  pnpm install --frozen-lockfile

  Write-Info "Generating Prisma client..."
  pnpm prisma:generate

  Write-Info "Building Next.js for $Environment ..."
  $env:NODE_ENV = $Environment
  pnpm build

  if (-not (Test-Path $OutDir)) { New-Item -ItemType Directory -Path $OutDir | Out-Null }
  Copy-Item -Recurse -Force ".next" (Join-Path $OutDir ".next")
  Copy-Item -Recurse -Force "public" (Join-Path $OutDir "public") -ErrorAction SilentlyContinue
  Copy-Item -Force "package.json" (Join-Path $OutDir "package.json")
  Copy-Item -Force "next.config.js" (Join-Path $OutDir "next.config.js")
  Copy-Item -Force "pnpm-lock.yaml" (Join-Path $OutDir "pnpm-lock.yaml") -ErrorAction SilentlyContinue
  Write-OK "Artifacts prepared at $OutDir"

  if ($Zip) {
    $zipPath = Join-Path $OutDir "hms-core2-$Environment.zip"
    if (Test-Path $zipPath) { Remove-Item $zipPath }
    Add-Type -AssemblyName 'System.IO.Compression.FileSystem'
    [System.IO.Compression.ZipFile]::CreateFromDirectory((Resolve-Path $OutDir), $zipPath)
    Write-OK "Zipped to $zipPath"
  }

  Write-Info "Deployment notes:" 
  Write-Host " - For Node hosting: copy artifacts, set env vars, run 'pnpm install --prod' then 'pnpm start'" -ForegroundColor Yellow
  Write-Host " - Ensure DATABASE_URL and NEXTAUTH_SECRET are set on host." -ForegroundColor Yellow
}
catch {
  Write-Err $_.Exception.Message
  exit 1
}
