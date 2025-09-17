Param(
  [string]$DatabaseUrl = "mysql://root:password@localhost:3306/HMSCORE2",
  [string]$NextAuthSecret = ""
)
$ErrorActionPreference = "Stop"

function Write-Info($msg){ Write-Host "[i] $msg" -ForegroundColor Cyan }
function Write-OK($msg){ Write-Host "[✓] $msg" -ForegroundColor Green }
function Write-Err($msg){ Write-Host "[x] $msg" -ForegroundColor Red }

try {
  Write-Info "Ensuring Corepack and pnpm are available..."
  node -v | Out-Null
  corepack enable | Out-Null
  corepack prepare pnpm@9.6.0 --activate | Out-Null
  Write-OK "pnpm ready"

  Write-Info "Installing dependencies..."
  pnpm install
  Write-OK "Dependencies installed"

  Write-Info "Preparing .env..."
  if (-Not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
  }
  (Get-Content ".env") | ForEach-Object {
    $_ -replace '^DATABASE_URL=.*$', "DATABASE_URL=\"$DatabaseUrl\""
  } | Set-Content ".env"
  if ([string]::IsNullOrEmpty($NextAuthSecret)) {
    $NextAuthSecret = [Convert]::ToBase64String((1..48 | ForEach-Object { [byte](Get-Random -Minimum 0 -Maximum 255) }))
  }
  (Get-Content ".env") | ForEach-Object {
    $_ -replace '^NEXTAUTH_SECRET=.*$', "NEXTAUTH_SECRET=\"$NextAuthSecret\""
  } | Set-Content ".env"
  Write-OK ".env configured"

  Write-Info "Generating Prisma Client..."
  pnpm prisma:generate
  Write-Info "Running Prisma migrate and seed..."
  pnpm prisma:migrate
  pnpm prisma:seed
  Write-OK "Database ready"

  Write-Info "Starting dev server at http://localhost:3000 ..."
  pnpm dev
}
catch {
  Write-Err $_.Exception.Message
  Write-Host "Possible fixes:" -ForegroundColor Yellow
  Write-Host " - Ensure Node.js >= 18.18 is installed (https://nodejs.org)." -ForegroundColor Yellow
  Write-Host " - Ensure MySQL is running and the user has privileges for HMSCORE2." -ForegroundColor Yellow
  Write-Host " - Update DATABASE_URL with correct credentials." -ForegroundColor Yellow
  exit 1
}
