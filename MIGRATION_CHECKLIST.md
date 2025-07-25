# Legacy Code Migration Checklist

## Pre-Migration Setup ✅

- [ ] **Backup Project**
  - [ ] Create git branch: `git checkout -b angular-17-migration`
  - [ ] Commit all current changes
  - [ ] Create backup of entire project folder

- [ ] **Environment Check**
  - [ ] Node.js version 18.13.0+ installed
  - [ ] NPM/Yarn latest version
  - [ ] Git working directory clean

## Core Angular Updates 🔄

### Angular CLI & Core Updates
- [ ] Angular 9 → 10 (TypeScript 3.9)
- [ ] Angular 10 → 11 (TypeScript 4.0)
- [ ] Angular 11 → 12 (TypeScript 4.2, Ivy fully enabled)
- [ ] Angular 12 → 13 (TypeScript 4.4, Angular Package Format)
- [ ] Angular 13 → 14 (TypeScript 4.7, Standalone components)
- [ ] Angular 14 → 15 (TypeScript 4.8, MDC-based Material)
- [ ] Angular 15 → 16 (TypeScript 5.0, Angular signals)
- [ ] Angular 16 → 17 (TypeScript 5.2, New app builder)

### Test After Each Major Update
- [ ] `npm test` passes
- [ ] `npm run build` succeeds
- [ ] Basic app functionality works

## Dependencies Updates 📦

### Angular Ecosystem
- [ ] `@angular/material` to v17
- [ ] `@angular/fire` to v17 (Firebase v9 modular SDK)
- [ ] `@angular/cdk` to v17
- [ ] `@ng-bootstrap/ng-bootstrap` to v16+

### Third-party Libraries
- [ ] `bootstrap` to v5.3+
- [ ] `@fortawesome/*` packages to latest
- [ ] `firebase` to v10+
- [ ] `rxjs` to v7.8+
- [ ] `zone.js` to v0.14+

## Code Modernization 🔧

### TypeScript Configuration
- [ ] Update `tsconfig.json` with strict mode
- [ ] Enable `"strict": true`
- [ ] Enable `"noImplicitOverride": true`
- [ ] Enable `"noPropertyAccessFromIndexSignature": true`
- [ ] Update target to `"ES2022"`

### ESLint Migration (Replace TSLint)
- [ ] Install `@angular-eslint/schematics`
- [ ] Remove `tslint.json` files
- [ ] Create `.eslintrc.json` configuration
- [ ] Update lint scripts in `package.json`
- [ ] Fix all ESLint errors

### Firebase v9 Modular SDK Migration
- [ ] **Auth Service Updates**
  ```typescript
  // OLD (v7)
  import * as firebase from 'firebase/app';
  firebase.auth().signInWithEmailAndPassword(email, password)
  
  // NEW (v9)
  import { signInWithEmailAndPassword } from '@angular/fire/auth';
  signInWithEmailAndPassword(auth, email, password)
  ```

- [ ] Update import statements
- [ ] Replace `firebase.auth()` with modular functions
- [ ] Update error handling patterns
- [ ] Test authentication flows

### Component Updates
- [ ] **Remove deprecated patterns**
  - [ ] Remove `entryComponents` from `app.module.ts`
  - [ ] Update Material imports to individual modules
  - [ ] Fix deprecated `@ViewChild` usages

- [ ] **Update Testing Patterns**
  ```typescript
  // OLD
  beforeEach(async(() => {
    TestBed.configureTestingModule({...}).compileComponents();
  }));
  
  // NEW
  beforeEach(async () => {
    await TestBed.configureTestingModule({...}).compileComponents();
  });
  ```

### Angular Material Updates
- [ ] Update component selectors (check for breaking changes)
- [ ] Update theme imports
- [ ] Test Material components functionality
- [ ] Update form field appearances if needed

## Build Configuration Updates ⚙️

### angular.json Updates
- [ ] Remove deprecated `extractCss` option
- [ ] Update `vendorChunk` to `false` if needed
- [ ] Update bundle budgets format
- [ ] Test production build

### Package.json Scripts
- [ ] Update lint script to use ESLint
- [ ] Update build script (remove `--prod` flag)
- [ ] Add any new scripts for Angular 17

## Code Quality Improvements 📈

### Type Safety
- [ ] Add proper TypeScript types to all variables
- [ ] Fix `any` type usages
- [ ] Add interfaces for data models
- [ ] Enable strict template type checking

### RxJS Updates
- [ ] Update deprecated operators
- [ ] Fix subscription patterns
- [ ] Use `takeUntil` for component subscriptions
- [ ] Update import paths if needed

### Service Improvements
- [ ] Update `AccountService` with proper typing
- [ ] Add error handling in services
- [ ] Use dependency injection with `inject()` function where appropriate
- [ ] Add loading states and error states

## Testing & Validation 🧪

### Unit Tests
- [ ] All unit tests pass
- [ ] Update test configurations
- [ ] Fix deprecated testing utilities
- [ ] Add tests for new functionality

### Integration Tests
- [ ] E2E tests run successfully
- [ ] Update Protractor if still used (consider Cypress/Playwright)
- [ ] Test user authentication flows
- [ ] Test all major user journeys

### Manual Testing
- [ ] Login/logout functionality
- [ ] User registration
- [ ] Navigation between pages
- [ ] Form submissions
- [ ] Material UI components
- [ ] Responsive design
- [ ] Error handling

## Performance & Security 🔒

### Performance
- [ ] Bundle size analysis (`ng build --stats-json`)
- [ ] Lazy loading implementation check
- [ ] OnPush change detection where appropriate
- [ ] Image optimization

### Security
- [ ] Run `npm audit` and fix vulnerabilities
- [ ] Update all dependencies to latest secure versions
- [ ] Review and update Content Security Policy
- [ ] Check for exposed sensitive data

## Documentation & Deployment 📚

### Documentation Updates
- [ ] Update README.md with new requirements
- [ ] Update development setup instructions
- [ ] Document breaking changes
- [ ] Update API documentation

### Deployment
- [ ] Update CI/CD pipeline configurations
- [ ] Test deployment process
- [ ] Update environment configurations
- [ ] Verify production build works

## Final Checklist ✅

- [ ] All tests pass (unit + e2e)
- [ ] No console errors in browser
- [ ] Application loads and functions correctly
- [ ] Authentication works properly
- [ ] All pages/routes accessible
- [ ] Forms submit correctly
- [ ] Responsive design maintained
- [ ] Performance is acceptable
- [ ] No security vulnerabilities (`npm audit`)
- [ ] Code follows Angular style guide
- [ ] ESLint passes with no errors
- [ ] TypeScript compiles without errors

## Post-Migration Tasks 📋

- [ ] **Performance Monitoring**
  - [ ] Set up performance budgets
  - [ ] Monitor bundle sizes
  - [ ] Track Core Web Vitals

- [ ] **Monitoring & Logging**
  - [ ] Update error logging
  - [ ] Set up performance monitoring
  - [ ] Update analytics if used

- [ ] **Team Training**
  - [ ] Document new patterns and practices
  - [ ] Train team on Angular 17 features
  - [ ] Update development guidelines

## Emergency Rollback Plan 🚨

If migration fails:
1. Switch back to backup branch: `git checkout main`
2. Verify original functionality
3. Analyze migration issues
4. Plan incremental migration approach

---

**📅 Estimated Timeline:** 4-6 weeks
**🎯 Success Criteria:** All functionality working with Angular 17 + TypeScript 5.2
**📞 Support:** Refer to Angular Update Guide and Migration Documentation
