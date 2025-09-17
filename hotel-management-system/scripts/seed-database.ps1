# Database connection parameters
$MYSQL_USER = "root"
$MYSQL_PASSWORD = "root"
$MYSQL_HOST = "localhost"
$MYSQL_PORT = "3306"
$MYSQL_DATABASE = "HMSCORE2"

# Path to the seed SQL file
$SEED_FILE = "$PSScriptRoot\..\database\seed.sql"

# Check if MySQL is running
$mysqlService = Get-Service -Name "MySQL*" -ErrorAction SilentlyContinue
if (-not $mysqlService -or $mysqlService.Status -ne "Running") {
    Write-Error "MySQL service is not running. Please start MySQL and try again."
    exit 1
}

# Check if MySQL client is installed
$mysqlPath = Get-Command "mysql" -ErrorAction SilentlyContinue
if (-not $mysqlPath) {
    Write-Error "MySQL client is not found. Please ensure MySQL is installed and added to your PATH."
    exit 1
}

# Check if the seed file exists
if (-not (Test-Path $SEED_FILE)) {
    Write-Error "Seed file not found at: $SEED_FILE"
    exit 1
}

# Execute the seed script
Write-Host "Seeding database '$MYSQL_DATABASE' with sample data..." -ForegroundColor Cyan

$env:MYSQL_PWD = $MYSQL_PASSWORD
$command = "mysql -h $MYSQL_HOST -P $MYSQL_PORT -u $MYSQL_USER $MYSQL_DATABASE < `"$SEED_FILE`""

try {
    # Using cmd /c to handle the redirection properly
    cmd /c $command
    
    if ($LASTEXITCODE -ne 0) {
        throw "MySQL command failed with exit code $LASTEXITCODE"
    }
    
    Write-Host "`n✅ Database seeded successfully!" -ForegroundColor Green
    Write-Host "   Sample data has been loaded into the database." -ForegroundColor Green
    
    # Display summary of seeded data
    $summaryCommand = @"
    SELECT 'Room Types' AS 'Table', COUNT(*) AS 'Count' FROM room_types
    UNION ALL
    SELECT 'Rooms', COUNT(*) FROM rooms
    UNION ALL
    SELECT 'Guests', COUNT(*) FROM guests
    UNION ALL
    SELECT 'Reservations', COUNT(*) FROM reservations
    UNION ALL
    SELECT 'Payments', COUNT(*) FROM payments;
"@
    
    $summaryCommand | Out-File -FilePath "$env:TEMP\temp_query.sql" -Encoding ascii
    $summary = mysql -h $MYSQL_HOST -P $MYSQL_PORT -u $MYSQL_USER $MYSQL_DATABASE -e "source $env:TEMP\temp_query.sql" 2>&1
    Remove-Item "$env:TEMP\temp_query.sql" -ErrorAction SilentlyContinue
    
    Write-Host "`n📊 Database Summary:" -ForegroundColor Cyan
    $summary | Format-Table -AutoSize
    
} catch {
    Write-Error "Error seeding database: $_"
    exit 1
} finally {
    # Clear the password from environment
    $env:MYSQL_PWD = $null
}
