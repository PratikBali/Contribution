# Day 2 Tasks

## Angular Core Updates

### Morning Session (4 hours):
1. **9:00-10:30**: Update local Angular 9 → 10 → 11
   - Update CLI and core packages
   - **Install Development Dependencies**:
     - `npm install --save-dev @angular/cli@10 @angular/core@10`
     - `npm install --save-dev @angular/cli@11 @angular/core@11`
     - `npm install --save-dev typescript@4.0`
   - **Project Scan & Analysis**:
     - Scan complete project for compatibility issues
     - Identify deprecation warnings
     - Check ESLint and TypeScript issues
     - Document migration requirements
   - **Build & Test**:
     - Run `npm run tsc` (TypeScript compilation check)
     - Run `npm run build` (Production build)
     - Fix any compilation/build errors
   - Fix TypeScript 4.0 compatibility issues
   - Test each version thoroughly

2. **10:30-12:00**: Update local Angular 11 → 12 → 13
   - Enable Ivy renderer fully
   - Handle Angular Package Format changes
   - Update build configurations
   - **Install Development Dependencies**:
     - `npm install --save-dev @angular/cli@12 @angular/core@12`
     - `npm install --save-dev @angular/cli@13 @angular/core@13`
     - `npm install --save-dev typescript@4.4`
   - **Project Scan & Analysis**:
     - Scan complete project for compatibility issues
     - Identify deprecation warnings
     - Check ESLint and TypeScript issues
     - Document migration requirements
   - **Build & Test**:
     - Run `npm run tsc` (TypeScript compilation)
     - Run `npm run build` (Production build)
     - **⏸️ PAUSE FOR AI REVIEW**: Wait for AI analysis of build output and next steps
     - Fix any compilation/build errors

### Afternoon Session (4 hours):
3. **1:00-2:30**: Update local Angular 13 → 14
   - Standalone components support
   - TypeScript 4.7 updates
   - Material Design updates
   - **Install Development Dependencies**:
     - `npm install --save-dev @angular/cli@14 @angular/core@14`
     - `npm install --save-dev @angular/material@14`
     - `npm install --save-dev typescript@4.7`
   - **Project Scan & Analysis**:
     - Scan complete project for compatibility issues
     - Identify deprecation warnings
     - Check ESLint and TypeScript issues
     - Document migration requirements
   - **Build & Test**:
     - Run `npm run tsc` (TypeScript compilation)
     - Run `npm run build` (Production build)
     - **⏸️ PAUSE FOR AI REVIEW**: Wait for AI analysis of build output and next steps
     - Fix any compilation/build errors

4. **2:30-4:00**: Update local Angular 14 → 15
   - MDC-based Angular Material
   - TypeScript 4.8 updates
   - Resolve breaking changes
   - **Install Development Dependencies**:
     - `npm install --save-dev @angular/cli@15 @angular/core@15`
     - `npm install --save-dev @angular/material@15`
     - `npm install --save-dev typescript@4.8`
     - `npm install --save-dev @angular-eslint/builder@15`
     - `npm install --save-dev @angular-eslint/eslint-plugin@15`
   - **Project Scan & Analysis**:
     - Scan complete project for compatibility issues
     - Identify deprecation warnings
     - Check ESLint and TypeScript issues
     - Document migration requirements
   - **Build & Test**:
     - Run `npm run tsc` (TypeScript compilation)
     - Run `npm run build` (Production build)
     - **⏸️ PAUSE FOR AI REVIEW**: Wait for AI analysis of build output and next steps
     - Fix any compilation/build errors

### Deliverables:
- Angular 15 with TypeScript 4.8
- All packages installed as dev dependencies
- All builds passing (`npm run tsc` && `npm run build`)
- Zero compilation errors
- Core functionality working
- Documented issues and fixes