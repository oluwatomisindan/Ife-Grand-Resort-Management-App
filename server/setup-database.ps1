# Database Setup Script for Windows PowerShell
# This script helps you set up the PostgreSQL database for the Ife Grand Resort Management App

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Ife Grand Resort - Database Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if PostgreSQL is installed
Write-Host "Checking for PostgreSQL installation..." -ForegroundColor Yellow
$psqlPath = Get-Command psql -ErrorAction SilentlyContinue

if (-not $psqlPath) {
    Write-Host "ERROR: PostgreSQL (psql) not found in PATH!" -ForegroundColor Red
    Write-Host "Please install PostgreSQL or add it to your system PATH." -ForegroundColor Red
    Write-Host "Download from: https://www.postgresql.org/download/" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ PostgreSQL found!" -ForegroundColor Green
Write-Host ""

# Get database credentials
Write-Host "Enter your PostgreSQL credentials:" -ForegroundColor Cyan
$dbUser = Read-Host "Database User (default: postgres)"
if ([string]::IsNullOrWhiteSpace($dbUser)) { $dbUser = "postgres" }

$dbName = Read-Host "Database Name (default: ife_resort_db)"
if ([string]::IsNullOrWhiteSpace($dbName)) { $dbName = "ife_resort_db" }

$dbHost = Read-Host "Database Host (default: localhost)"
if ([string]::IsNullOrWhiteSpace($dbHost)) { $dbHost = "localhost" }

$dbPort = Read-Host "Database Port (default: 5432)"
if ([string]::IsNullOrWhiteSpace($dbPort)) { $dbPort = "5432" }

Write-Host ""
Write-Host "Using configuration:" -ForegroundColor Cyan
Write-Host "  User: $dbUser" -ForegroundColor White
Write-Host "  Database: $dbName" -ForegroundColor White
Write-Host "  Host: $dbHost" -ForegroundColor White
Write-Host "  Port: $dbPort" -ForegroundColor White
Write-Host ""

# Confirm
$confirm = Read-Host "Proceed with database setup? (Y/N)"
if ($confirm -ne "Y" -and $confirm -ne "y") {
    Write-Host "Setup cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Setting up database..." -ForegroundColor Yellow

# Run the SQL script
$scriptPath = Join-Path $PSScriptRoot "complete_database_setup.sql"

if (-not (Test-Path $scriptPath)) {
    Write-Host "ERROR: complete_database_setup.sql not found!" -ForegroundColor Red
    Write-Host "Expected location: $scriptPath" -ForegroundColor Red
    exit 1
}

try {
    # Execute the SQL script
    $env:PGPASSWORD = Read-Host "Enter PostgreSQL password" -AsSecureString
    $env:PGPASSWORD = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($env:PGPASSWORD))
    
    psql -h $dbHost -p $dbPort -U $dbUser -d $dbName -f $scriptPath
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✓ Database setup completed successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Default Super Admin credentials:" -ForegroundColor Cyan
        Write-Host "  Email: superadmin@ife.com" -ForegroundColor White
        Write-Host "  Password: password123" -ForegroundColor White
        Write-Host ""
        Write-Host "IMPORTANT: Change the default password after first login!" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "1. Update .env file with your database credentials" -ForegroundColor White
        Write-Host "2. Restart the backend server: npm run server" -ForegroundColor White
        Write-Host "3. Refresh the frontend application" -ForegroundColor White
    } else {
        Write-Host ""
        Write-Host "ERROR: Database setup failed!" -ForegroundColor Red
        Write-Host "Please check the error messages above." -ForegroundColor Red
    }
} catch {
    Write-Host ""
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
} finally {
    # Clear password from environment
    $env:PGPASSWORD = $null
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
