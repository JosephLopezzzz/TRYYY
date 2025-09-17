$ErrorActionPreference = "Stop"
function Write-Info($m){ Write-Host "[i] $m" -ForegroundColor Cyan }
function Write-OK($m){ Write-Host "[✓] $m" -ForegroundColor Green }
function Write-Err($m){ Write-Host "[x] $m" -ForegroundColor Red }

try {
  if (-not (Test-Path ".git")) { git init | Out-Null }
  git add .
  git commit -m "chore(init): HMS Core 2 scaffold with Next.js 14, Prisma 5, Tailwind, RBAC, modules, and scripts"
  git tag v0.1.0
  Write-OK "Repository initialized and tagged v0.1.0"
}
catch {
  Write-Err $_.Exception.Message
  Write-Host "Ensure git is installed and configured (name/email)." -ForegroundColor Yellow
  exit 1
}
