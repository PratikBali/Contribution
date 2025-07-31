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

  constructor(private afAuth: AngularFireAuth) {
    // Type assertion needed due to RxJS version conflicts between @angular/fire and main project
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.user$ = this.afAuth.user as any;
  }

  async doRegister(value: RegisterData): Promise<firebase.auth.UserCredential> {
    try {
      return await this.afAuth.createUserWithEmailAndPassword(value.email, value.password);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Registration error:', error);
      throw error;
    }
  }

  async doEmailLogin(credentials: LoginCredentials): Promise<firebase.auth.UserCredential> {
    try {
      return await this.afAuth.signInWithEmailAndPassword(credentials.username, credentials.password);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Login error:', error);
      throw error;
    }
  }

  async doGoogleLogin(): Promise<firebase.auth.UserCredential> {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      return await this.afAuth.signInWithPopup(provider);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Google login error:', error);
      throw error;
    }
  }

  async doLogout(): Promise<void> {
    try {
      await this.afAuth.signOut();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Logout error:', error);
      throw error;
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as any;
  }
}