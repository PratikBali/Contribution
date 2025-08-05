/* eslint-disable no-undef */
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { map, catchError, timeout } from 'rxjs/operators';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { FirebaseAppCheckService } from './firebase-app-check.service';

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Observable of the current user
  readonly user$: Observable<firebase.User | null>;
  
  // Timeout for authentication operations (30 seconds)
  private readonly AUTH_TIMEOUT = 30000;

  constructor(
    private readonly afAuth: AngularFireAuth,
    private readonly appCheckService: FirebaseAppCheckService
  ) {
    // Type assertion needed due to RxJS version conflicts between @angular/fire and main project
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.user$ = this.afAuth.user as any;
    
    // Validate security context on initialization
    this.validateSecurityContext();
  }

  /**
   * Validate security context and domain
   */
  private validateSecurityContext(): void {
    if (!this.appCheckService.validateDomain()) {
      console.error('Invalid domain detected. Authentication may be restricted.');
    }
    
    if (!this.appCheckService.isSecureContext()) {
      console.warn('Insecure context detected. Use HTTPS in production.');
    }
  }

  async doRegister(value: RegisterData): Promise<firebase.auth.UserCredential> {
    try {
      return await this.afAuth.createUserWithEmailAndPassword(value.email, value.password);
    } catch (error) {
      // Re-throw with sanitized error message
      const firebaseError = error as firebase.auth.Error;
      throw new Error(this.getFirebaseErrorMessage(firebaseError.code || 'unknown'));
    }
  }

  async doEmailLogin(credentials: LoginCredentials): Promise<firebase.auth.UserCredential> {
    try {
      return await this.afAuth.signInWithEmailAndPassword(credentials.username, credentials.password);
    } catch (error) {
      // Re-throw with sanitized error message
      const firebaseError = error as firebase.auth.Error;
      throw new Error(this.getFirebaseErrorMessage(firebaseError.code || 'unknown'));
    }
  }

  async doGoogleLogin(): Promise<firebase.auth.UserCredential> {
    try {
      // Validate security context before login
      if (!this.appCheckService.validateDomain()) {
        throw new Error('Authentication not allowed from this domain');
      }

      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      
      // Set custom parameters for better user experience
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      // Add timeout to prevent hanging
      const result = await Promise.race([
        this.afAuth.signInWithPopup(provider),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Authentication timeout')), this.AUTH_TIMEOUT)
        )
      ]);
      
      return result;
    } catch (error) {
      // Re-throw with sanitized error message
      const firebaseError = error as firebase.auth.Error;
      const errorObj = error as Error;
      const errorMessage = this.getFirebaseErrorMessage(firebaseError.code || errorObj.message || 'unknown');
      
      // Log detailed error for debugging (development only)
      if (window.location.hostname === 'localhost') {
        console.error('Google login error details:', error);        
      }
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Enhanced error handling with security context
   */
  async doLogout(): Promise<void> {
    try {
      await Promise.race([
        this.afAuth.signOut(),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Logout timeout')), 10000)
        )
      ]);
    } catch (error) {
      // Log error but don't throw - logout should always succeed from UI perspective
      console.error('Logout error:', error);
    }
  }

  getCurrentUser(): Observable<firebase.User | null> {
    // Type assertion needed due to RxJS version conflicts between @angular/fire and main project
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.afAuth.user as any;
  }

  isLoggedIn(): Observable<boolean> {
    // Type assertion needed due to RxJS version conflicts between @angular/fire and main project
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this.afAuth.authState as any).pipe(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      map((user: any) => user !== null)
    );
  }

  /**
   * Get the current user's authentication state
   */
  getAuthState(): Observable<firebase.User | null> {
    // Type assertion needed due to RxJS version conflicts between @angular/fire and main project
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.afAuth.authState as any;
  }

  /**
   * Check if the current user is authenticated with Google
   */
  isGoogleUser(): Observable<boolean> {
    // Type assertion needed due to RxJS version conflicts between @angular/fire and main project
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this.afAuth.authState as any).pipe(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      map((user: any) => {
        if (!user) return false;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return user.providerData.some((provider: any) => provider?.providerId === 'google.com');
      })
    );
  }

  /**
   * Link Google account to existing user (for users who signed up with email/password)
   */
  async linkGoogleAccount(): Promise<firebase.auth.UserCredential> {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      
      const currentUser = await this.afAuth.currentUser;
      if (!currentUser) {
        throw new Error('No user is currently signed in');
      }
      
      return await currentUser.linkWithPopup(provider);
    } catch (error) {
      const firebaseError = error as firebase.auth.Error;
      throw new Error(this.getFirebaseErrorMessage(firebaseError.code || 'unknown'));
    }
  }

  /**
   * Get user-friendly error message from Firebase error code
   */
  private getFirebaseErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address';
      case 'auth/wrong-password':
        return 'Invalid password';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists';
      case 'auth/weak-password':
        return 'Password is too weak';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later';
      case 'auth/popup-closed-by-user':
        return 'Login cancelled by user';
      case 'auth/popup-blocked':
        return 'Popup blocked. Please allow popups for this site and try again';
      case 'auth/cancelled-popup-request':
        return 'Another popup is already open. Please close it and try again';
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with the same email but different sign-in credentials';
      case 'auth/credential-already-in-use':
        return 'This Google account is already linked to another user';
      case 'auth/operation-not-allowed':
        return 'Google sign-in is not enabled. Please contact support';
      case 'auth/unauthorized-domain':
        return 'This domain is not authorized for Google sign-in';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection';
      case 'auth/internal-error':
        return 'Internal error occurred. Please try again';
      case 'auth/invalid-api-key':
        return 'Configuration error. Please contact support';
      case 'auth/app-not-authorized':
        return 'App not authorized. Please contact support';
      case 'auth/invalid-user-token':
        return 'Session expired. Please sign in again';
      case 'auth/user-token-expired':
        return 'Session expired. Please sign in again';
      case 'auth/null-user':
        return 'No user is currently signed in';
      case 'auth/invalid-tenant-id':
        return 'Invalid tenant configuration';
      case 'Authentication timeout':
        return 'Authentication is taking too long. Please check your connection and try again';
      case 'Authentication not allowed from this domain':
        return 'Authentication not allowed from this domain';
      default:
        // Sanitize unknown errors to prevent information leakage
        return 'Authentication failed. Please try again';
    }
  }
}