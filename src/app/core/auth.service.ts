import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
  constructor(private afAuth: AngularFireAuth) {}
  
  // Observable of the current user
  readonly user$: Observable<firebase.User | null> = this.afAuth.authState;

  async doRegister(value: RegisterData): Promise<firebase.auth.UserCredential> {
    try {
      return await this.afAuth.auth.createUserWithEmailAndPassword(value.email, value.password);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async doEmailLogin(credentials: LoginCredentials): Promise<firebase.auth.UserCredential> {
    try {
      return await this.afAuth.auth.signInWithEmailAndPassword(credentials.username, credentials.password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async doGoogleLogin(): Promise<firebase.auth.UserCredential> {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      return await this.afAuth.auth.signInWithPopup(provider);
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }

  async doLogout(): Promise<void> {
    try {
      await this.afAuth.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  getCurrentUser(): Observable<firebase.User | null> {
    return this.afAuth.authState;
  }

  isLoggedIn(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      map(user => user !== null)
    );
  }
}
