/* eslint-disable no-undef */
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

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

  constructor(private readonly afAuth: AngularFireAuth) {
    // Type assertion needed due to RxJS version conflicts between @angular/fire and main project
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.user$ = this.afAuth.user as any;
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
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      
      // Set custom parameters for better user experience
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      return await this.afAuth.signInWithPopup(provider);
    } catch (error) {
      // Re-throw with sanitized error message
      const firebaseError = error as firebase.auth.Error;
      throw new Error(this.getFirebaseErrorMessage(firebaseError.code || 'unknown'));
    }
  }

  async doLogout(): Promise<void> {
    await this.afAuth.signOut();
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
      default:
        return 'Authentication failed. Please try again';
    }
  }
}