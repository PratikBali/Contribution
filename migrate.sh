#!/bin/bash

# Angular Migration Script - From v9 to v17
# Run this script step by step, testing after each major version

echo "🚀 Starting Angular Migration from v9 to v17"
echo "⚠️  Make sure you have backed up your project and created a new git branch!"

# Step 0: Verify Node.js version
echo "📋 Checking Node.js version..."
node_version=$(node -v)
echo "Current Node.js version: $node_version"

if [[ ! "$node_version" =~ ^v1[8-9]|^v2[0-9] ]]; then
    echo "❌ Node.js version 18.13.0 or higher is required for Angular 17"
    echo "Please update Node.js before continuing"
    exit 1
fi

# Step 1: Install latest Angular CLI globally
echo "📦 Installing Angular CLI v17..."
npm install -g @angular/cli@17

# Step 2: Update Angular step by step
echo "🔄 Starting incremental Angular updates..."

# Angular 9 to 10
echo "⬆️  Updating Angular 9 → 10..."
ng update @angular/cli@10 @angular/core@10 --force
if [ $? -ne 0 ]; then
    echo "❌ Failed to update to Angular 10. Please fix issues and try again."
    exit 1
fi

echo "✅ Angular 10 update complete. Running tests..."
npm test -- --watch=false --browsers=ChromeHeadless
npm run build

# Angular 10 to 11
echo "⬆️  Updating Angular 10 → 11..."
ng update @angular/cli@11 @angular/core@11 --force
if [ $? -ne 0 ]; then
    echo "❌ Failed to update to Angular 11. Please fix issues and try again."
    exit 1
fi

echo "✅ Angular 11 update complete. Running tests..."
npm test -- --watch=false --browsers=ChromeHeadless
npm run build

# Angular 11 to 12
echo "⬆️  Updating Angular 11 → 12..."
ng update @angular/cli@12 @angular/core@12 --force
if [ $? -ne 0 ]; then
    echo "❌ Failed to update to Angular 12. Please fix issues and try again."
    exit 1
fi

echo "✅ Angular 12 update complete. Running tests..."
npm test -- --watch=false --browsers=ChromeHeadless
npm run build

# Angular 12 to 13
echo "⬆️  Updating Angular 12 → 13..."
ng update @angular/cli@13 @angular/core@13 --force
if [ $? -ne 0 ]; then
    echo "❌ Failed to update to Angular 13. Please fix issues and try again."
    exit 1
fi

echo "✅ Angular 13 update complete. Running tests..."
npm test -- --watch=false --browsers=ChromeHeadless
npm run build

# Angular 13 to 14
echo "⬆️  Updating Angular 13 → 14..."
ng update @angular/cli@14 @angular/core@14 --force
if [ $? -ne 0 ]; then
    echo "❌ Failed to update to Angular 14. Please fix issues and try again."
    exit 1
fi

echo "✅ Angular 14 update complete. Running tests..."
npm test -- --watch=false --browsers=ChromeHeadless
npm run build

# Angular 14 to 15
echo "⬆️  Updating Angular 14 → 15..."
ng update @angular/cli@15 @angular/core@15 --force
if [ $? -ne 0 ]; then
    echo "❌ Failed to update to Angular 15. Please fix issues and try again."
    exit 1
fi

echo "✅ Angular 15 update complete. Running tests..."
npm test -- --watch=false --browsers=ChromeHeadless
npm run build

# Angular 15 to 16
echo "⬆️  Updating Angular 15 → 16..."
ng update @angular/cli@16 @angular/core@16 --force
if [ $? -ne 0 ]; then
    echo "❌ Failed to update to Angular 16. Please fix issues and try again."
    exit 1
fi

echo "✅ Angular 16 update complete. Running tests..."
npm test -- --watch=false --browsers=ChromeHeadless
npm run build

# Angular 16 to 17
echo "⬆️  Updating Angular 16 → 17..."
ng update @angular/cli@17 @angular/core@17 --force
if [ $? -ne 0 ]; then
    echo "❌ Failed to update to Angular 17. Please fix issues and try again."
    exit 1
fi

echo "✅ Angular 17 update complete!"

# Update Angular Material
echo "📦 Updating Angular Material to v17..."
ng update @angular/material@17 --force

# Update Angular Fire
echo "🔥 Updating Angular Fire to v17..."
ng update @angular/fire@17 --force

# Replace TSLint with ESLint
echo "🔧 Setting up ESLint (replacing TSLint)..."
ng add @angular-eslint/schematics --force

# Remove TSLint files
echo "🗑️  Removing TSLint configuration files..."
rm -f tslint.json
rm -f src/tslint.json

# Update npm scripts
echo "📝 Updating package.json scripts..."
npm pkg set scripts.lint="ng lint"

# Install additional ESLint plugins
echo "📦 Installing additional ESLint plugins..."
npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser

# Run final tests and build
echo "🧪 Running final tests and build..."
npm test -- --watch=false --browsers=ChromeHeadless
npm run build

# Security audit
echo "🔒 Running security audit..."
npm audit

echo "🎉 Migration complete!"
echo ""
echo "📋 Next steps:"
echo "1. Review and fix any remaining TypeScript errors"
echo "2. Update Firebase imports to use v9 modular SDK"
echo "3. Test all functionality thoroughly"
echo "4. Update CI/CD configurations"
echo "5. Update documentation"
echo ""
echo "📄 Check MIGRATION_PLAN.md for detailed information about breaking changes"
