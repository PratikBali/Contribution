@echo off
REM Angular Migration Script - From v9 to v17 (Windows)
REM Run this script step by step, testing after each major version

echo 🚀 Starting Angular Migration from v9 to v17
echo ⚠️  Make sure you have backed up your project and created a new git branch!

REM Step 0: Verify Node.js version
echo 📋 Checking Node.js version...
node -v
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    exit /b 1
)

REM Step 1: Install latest Angular CLI globally
echo 📦 Installing Angular CLI v17...
npm install -g @angular/cli@17
if %errorlevel% neq 0 (
    echo ❌ Failed to install Angular CLI
    exit /b 1
)

REM Step 2: Update Angular step by step
echo 🔄 Starting incremental Angular updates...

REM Angular 9 to 10
echo ⬆️  Updating Angular 9 → 10...
call ng update @angular/cli@10 @angular/core@10 --force
if %errorlevel% neq 0 (
    echo ❌ Failed to update to Angular 10. Please fix issues and try again.
    exit /b 1
)

echo ✅ Angular 10 update complete. Running tests...
call npm test -- --watch=false --browsers=ChromeHeadless
call npm run build

REM Angular 10 to 11
echo ⬆️  Updating Angular 10 → 11...
call ng update @angular/cli@11 @angular/core@11 --force
if %errorlevel% neq 0 (
    echo ❌ Failed to update to Angular 11. Please fix issues and try again.
    exit /b 1
)

echo ✅ Angular 11 update complete. Running tests...
call npm test -- --watch=false --browsers=ChromeHeadless
call npm run build

REM Angular 11 to 12
echo ⬆️  Updating Angular 11 → 12...
call ng update @angular/cli@12 @angular/core@12 --force
if %errorlevel% neq 0 (
    echo ❌ Failed to update to Angular 12. Please fix issues and try again.
    exit /b 1
)

echo ✅ Angular 12 update complete. Running tests...
call npm test -- --watch=false --browsers=ChromeHeadless
call npm run build

REM Angular 12 to 13
echo ⬆️  Updating Angular 12 → 13...
call ng update @angular/cli@13 @angular/core@13 --force
if %errorlevel% neq 0 (
    echo ❌ Failed to update to Angular 13. Please fix issues and try again.
    exit /b 1
)

echo ✅ Angular 13 update complete. Running tests...
call npm test -- --watch=false --browsers=ChromeHeadless
call npm run build

REM Angular 13 to 14
echo ⬆️  Updating Angular 13 → 14...
call ng update @angular/cli@14 @angular/core@14 --force
if %errorlevel% neq 0 (
    echo ❌ Failed to update to Angular 14. Please fix issues and try again.
    exit /b 1
)

echo ✅ Angular 14 update complete. Running tests...
call npm test -- --watch=false --browsers=ChromeHeadless
call npm run build

REM Angular 14 to 15
echo ⬆️  Updating Angular 14 → 15...
call ng update @angular/cli@15 @angular/core@15 --force
if %errorlevel% neq 0 (
    echo ❌ Failed to update to Angular 15. Please fix issues and try again.
    exit /b 1
)

echo ✅ Angular 15 update complete. Running tests...
call npm test -- --watch=false --browsers=ChromeHeadless
call npm run build

REM Angular 15 to 16
echo ⬆️  Updating Angular 15 → 16...
call ng update @angular/cli@16 @angular/core@16 --force
if %errorlevel% neq 0 (
    echo ❌ Failed to update to Angular 16. Please fix issues and try again.
    exit /b 1
)

echo ✅ Angular 16 update complete. Running tests...
call npm test -- --watch=false --browsers=ChromeHeadless
call npm run build

REM Angular 16 to 17
echo ⬆️  Updating Angular 16 → 17...
call ng update @angular/cli@17 @angular/core@17 --force
if %errorlevel% neq 0 (
    echo ❌ Failed to update to Angular 17. Please fix issues and try again.
    exit /b 1
)

echo ✅ Angular 17 update complete!

REM Update Angular Material
echo 📦 Updating Angular Material to v17...
call ng update @angular/material@17 --force

REM Update Angular Fire
echo 🔥 Updating Angular Fire to v17...
call ng update @angular/fire@17 --force

REM Replace TSLint with ESLint
echo 🔧 Setting up ESLint (replacing TSLint)...
call ng add @angular-eslint/schematics --force

REM Remove TSLint files
echo 🗑️  Removing TSLint configuration files...
if exist tslint.json del tslint.json
if exist src\tslint.json del src\tslint.json

REM Install additional ESLint plugins
echo 📦 Installing additional ESLint plugins...
call npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser

REM Run final tests and build
echo 🧪 Running final tests and build...
call npm test -- --watch=false --browsers=ChromeHeadless
call npm run build

REM Security audit
echo 🔒 Running security audit...
call npm audit

echo 🎉 Migration complete!
echo.
echo 📋 Next steps:
echo 1. Review and fix any remaining TypeScript errors
echo 2. Update Firebase imports to use v9 modular SDK
echo 3. Test all functionality thoroughly
echo 4. Update CI/CD configurations
echo 5. Update documentation
echo.
echo 📄 Check MIGRATION_PLAN.md for detailed information about breaking changes

pause
