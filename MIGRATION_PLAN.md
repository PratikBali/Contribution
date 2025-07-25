# Angular & TypeScript Migration Plan

## Current State
- **Angular**: 9.0.x → Target: 17.x (Latest LTS)
- **TypeScript**: 3.7.5 → Target: 5.2.x
- **Node**: Needs update to support Angular 17
- **Dependencies**: Multiple outdated packages

## Migration Strategy (Incremental Approach)

### Phase 1: Preparation & Environment Setup
1. **Update Node.js** to version 18.13.0 or later
2. **Backup project** and create new git branch
3. **Update development dependencies**
4. **Replace TSLint with ESLint**

### Phase 2: Angular Updates (Step-by-step)
Following Angular's update guide, we'll go through each major version:

#### Step 1: Angular 9 → 10
- Update Angular CLI and core packages
- Update TypeScript to 3.9.x
- Update Angular Material
- Fix breaking changes

#### Step 2: Angular 10 → 11
- Update to TypeScript 4.0.x
- Update Angular Fire to v6
- Remove deprecated APIs

#### Step 3: Angular 11 → 12
- Update to TypeScript 4.2.x
- Enable Ivy renderer fully
- Update build configurations

#### Step 4: Angular 12 → 13
- Update to TypeScript 4.4.x
- Angular Package Format changes
- Update testing configurations

#### Step 5: Angular 13 → 14
- Update to TypeScript 4.7.x
- Angular standalone components support
- Update Angular Material to v14

#### Step 6: Angular 14 → 15
- Update to TypeScript 4.8.x
- Material Design Components (MDC)
- Update Firebase to v9 modular SDK

#### Step 7: Angular 15 → 16
- Update to TypeScript 5.0.x
- Angular signals (optional)
- New control flow syntax preparation

#### Step 8: Angular 16 → 17
- Update to TypeScript 5.2.x
- New @angular/ssr package
- Latest Angular Material

### Phase 3: Code Modernization

#### 1. Firebase Migration (v7 → v9)
**Current (Legacy):**
```typescript
import * as firebase from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';

doEmailLogin(credentials) {
  return new Promise<any>((resolve, reject) => {
    firebase.auth().signInWithEmailAndPassword(credentials.username, credentials.password)
    .then(res => resolve(res), err => reject(err));
  });
}
```

**New (v9 Modular):**
```typescript
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { inject } from '@angular/core';

private auth = inject(Auth);

async doEmailLogin(credentials: LoginCredentials): Promise<UserCredential> {
  return signInWithEmailAndPassword(this.auth, credentials.username, credentials.password);
}
```

#### 2. Replace TSLint with ESLint
- Remove TSLint configuration
- Add ESLint with Angular-specific rules
- Update scripts in package.json

#### 3. Update Testing Patterns
**Current:**
```typescript
beforeEach(async(() => {
  TestBed.configureTestingModule({...}).compileComponents();
}));
```

**New:**
```typescript
beforeEach(async () => {
  await TestBed.configureTestingModule({...}).compileComponents();
});
```

#### 4. Modernize Component Patterns
- Remove `entryComponents` from app.module.ts
- Update Material imports to use individual modules
- Use standalone components where appropriate
- Implement proper TypeScript typing

#### 5. Update Build Configuration
- Remove deprecated options (`extractCss`, `vendorChunk`)
- Update to new bundle budgets format
- Optimize for modern browsers

## Implementation Commands

### 1. Install Angular CLI globally
```bash
npm install -g @angular/cli@17
```

### 2. Update project step by step
```bash
# Angular 9 → 10
ng update @angular/cli@10 @angular/core@10

# Angular 10 → 11  
ng update @angular/cli@11 @angular/core@11

# Continue for each version...
ng update @angular/cli@17 @angular/core@17
```

### 3. Update Angular Material
```bash
ng update @angular/material@17
```

### 4. Update Firebase
```bash
ng update @angular/fire@17
```

## Breaking Changes to Address

### 1. Firebase Authentication
- Update import statements
- Replace promise-based methods with observables
- Update error handling patterns

### 2. Angular Material
- Update component selectors (mat-* changes)
- Update theme configuration
- Fix breaking API changes

### 3. TypeScript Strict Mode
- Enable strict mode in tsconfig.json
- Fix type errors throughout codebase
- Add proper type annotations

### 4. RxJS Updates
- Update operators import patterns
- Replace deprecated operators
- Update subscription patterns

## Post-Migration Tasks

1. **Update package.json scripts**
2. **Run comprehensive testing**
3. **Update CI/CD configurations**
4. **Performance audit and optimization**
5. **Security audit with `npm audit`**
6. **Update documentation**

## Estimated Timeline
- **Phase 1**: 1-2 days
- **Phase 2**: 2-3 weeks (depending on breaking changes)
- **Phase 3**: 1-2 weeks
- **Testing & fixes**: 1 week

Total estimated time: **4-6 weeks** for complete migration

## Risks & Mitigation
1. **Breaking changes**: Test thoroughly at each step
2. **Third-party dependencies**: Check compatibility before updating
3. **Custom code conflicts**: Review and update deprecated patterns
4. **Performance regressions**: Benchmark before/after migration
