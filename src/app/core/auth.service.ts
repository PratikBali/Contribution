import { Injectable, inject } from '@angular/core';
import { 
  Auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  User,
  UserCredential 
} from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { authState } from '@angular/fire/auth';

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
  private readonly auth = inject(Auth);
  
  // Observable of the current user
  readonly user$: Observable<User | null> = authState(this.auth);

  async doRegister(value: RegisterData): Promise<UserCredential> {
    try {
      return await createUserWithEmailAndPassword(this.auth, value.email, value.password);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async doEmailLogin(credentials: LoginCredentials): Promise<UserCredential> {
    try {
      return await signInWithEmailAndPassword(this.auth, credentials.username, credentials.password);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async doGoogleLogin(): Promise<UserCredential> {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      return await signInWithPopup(this.auth, provider);
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }

  async doLogout(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  isLoggedIn(): boolean {
    return this.auth.currentUser !== null;
  }
}
