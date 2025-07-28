import { Injectable, inject } from '@angular/core';
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
  constructor(private afAuth: AngularFireAuth) {}
  
  // Observable of the current user
  readonly user$: Observable<firebase.User | null> = this.afAuth.user;

  async doRegister(value: RegisterData): Promise<firebase.auth.UserCredential> {
    try {
      return await this.afAuth.createUserWithEmailAndPassword(value.email, value.password);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async doEmailLogin(credentials: LoginCredentials): Promise<firebase.auth.UserCredential> {
    try {
      return await this.afAuth.signInWithEmailAndPassword(credentials.username, credentials.password);
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
      return await this.afAuth.signInWithPopup(provider);
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }

  async doLogout(): Promise<void> {
    try {
      await this.afAuth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  getCurrentUser(): Observable<firebase.User | null> {
    return this.afAuth.user;
  }

  isLoggedIn(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      map(user => user !== null)
    );
  }
}
