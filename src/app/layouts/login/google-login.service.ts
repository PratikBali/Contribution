import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { AccountService } from '../../common/account.service';
import firebase from 'firebase/compat/app';

export interface GoogleLoginState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GoogleLoginService {
  private readonly loginStateSubject = new BehaviorSubject<GoogleLoginState>({
    isLoading: false,
    error: null,
    success: false
  });

  readonly loginState$: Observable<GoogleLoginState> = this.loginStateSubject.asObservable();

  constructor(
    private authService: AuthService,
    private accountService: AccountService
  ) {}

  /**
   * Perform Google login with comprehensive error handling
   */
  async performGoogleLogin(): Promise<void> {
    this.setLoginState({ isLoading: true, error: null, success: false });

    try {
      // Check if popups are blocked
      await this.checkPopupSupport();

      // Perform Google login
      const result = await this.authService.doGoogleLogin();
      
      if (result.user) {
        // Set account with proper user data
        const userAccount = {
          id: result.user.uid,
          email: result.user.email || '',
          name: result.user.displayName || '',
          picture: result.user.photoURL || '',
          firstName: result.user.displayName?.split(' ')[0] || '',
          lastName: result.user.displayName?.split(' ').slice(1).join(' ') || '',
          activated: result.user.emailVerified,
          authorities: ['ROLE_USER'] // Default role
        };
        
        this.accountService.setAccount(userAccount);
        this.setLoginState({ isLoading: false, error: null, success: true });
      } else {
        throw new Error('No user data received from Google');
      }
    } catch (error) {
      const errorMessage = this.handleLoginError(error);
      this.setLoginState({ isLoading: false, error: errorMessage, success: false });
      throw new Error(errorMessage);
    }
  }

  /**
   * Check if the user is already logged in with Google
   */
  async isGoogleUserLoggedIn(): Promise<boolean> {
    try {
      const user = await this.authService.getCurrentUser().toPromise();
      if (!user) return false;
      
      return user.providerData.some((provider: firebase.UserInfo | null) => 
        provider && provider.providerId === 'google.com'
      );
    } catch {
      return false;
    }
  }

  /**
   * Get current Google user profile information
   */
  async getGoogleUserProfile(): Promise<any> {
    try {
      const user = await this.authService.getCurrentUser().toPromise();
      if (!user) return null;

      const googleProvider = user.providerData.find((provider: firebase.UserInfo | null) => 
        provider && provider.providerId === 'google.com'
      );

      if (googleProvider) {
        return {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          providerId: googleProvider.providerId
        };
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Refresh Google user token if needed
   */
  async refreshGoogleToken(): Promise<void> {
    try {
      const user = await this.authService.getCurrentUser().toPromise();
      if (user) {
        await user.getIdToken(true); // Force refresh
      }
    } catch (error) {
      throw new Error('Failed to refresh Google authentication token');
    }
  }

  /**
   * Link existing account with Google
   */
  async linkWithGoogle(): Promise<void> {
    this.setLoginState({ isLoading: true, error: null, success: false });

    try {
      await this.authService.linkGoogleAccount();
      this.setLoginState({ isLoading: false, error: null, success: true });
    } catch (error) {
      const errorMessage = this.handleLoginError(error);
      this.setLoginState({ isLoading: false, error: errorMessage, success: false });
      throw new Error(errorMessage);
    }
  }

  /**
   * Check popup support
   */
  private async checkPopupSupport(): Promise<void> {
    return new Promise((resolve, reject) => {
      const testPopup = window.open('', '_blank', 'width=1,height=1');
      
      if (!testPopup || testPopup.closed || typeof testPopup.closed === 'undefined') {
        reject(new Error('Popup blocked. Please allow popups for this site and try again.'));
      } else {
        testPopup.close();
        resolve();
      }
    });
  }

  /**
   * Handle and categorize login errors
   */
  private handleLoginError(error: any): string {
    if (error.message) {
      return error.message;
    }

    // Check for common error patterns
    const errorString = error.toString().toLowerCase();
    
    if (errorString.includes('popup')) {
      return 'Popup blocked or closed. Please allow popups and try again.';
    }
    
    if (errorString.includes('network')) {
      return 'Network error. Please check your connection and try again.';
    }
    
    if (errorString.includes('cancelled')) {
      return 'Login was cancelled. Please try again.';
    }
    
    return 'Google login failed. Please try again.';
  }

  /**
   * Set login state
   */
  private setLoginState(state: GoogleLoginState): void {
    this.loginStateSubject.next(state);
  }

  /**
   * Reset login state
   */
  resetLoginState(): void {
    this.setLoginState({ isLoading: false, error: null, success: false });
  }

  /**
   * Get troubleshooting tips based on common issues
   */
  getTroubleshootingTips(): string[] {
    return [
      'Make sure popups are enabled for this website',
      'Clear your browser cache and cookies',
      'Disable any ad blockers that might block the Google login popup',
      'Try using an incognito/private browsing window',
      'Make sure you have a stable internet connection',
      'Check if your Google account is active and not suspended',
      'Try logging out of all Google accounts and then try again',
      'Make sure third-party cookies are enabled',
      'Update your browser to the latest version'
    ];
  }
}
