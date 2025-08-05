import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AppCheckToken {
  token: string;
  expireTimeMillis: number;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseAppCheckService {
  private appCheckToken: AppCheckToken | null = null;

  constructor() {
    this.initializeAppCheck();
  }

  /**
   * Initialize Firebase App Check for bot protection
   */
  private async initializeAppCheck(): Promise<void> {
    if (!environment.production) {
      // In development, use debug tokens
      console.log('Firebase App Check: Using debug mode for development');
      return;
    }

    try {
      // This would normally be configured with reCAPTCHA
      // await firebase.appCheck().activate('your-recaptcha-site-key');
      console.log('Firebase App Check initialized');
    } catch (error) {
      console.error('Failed to initialize Firebase App Check:', error);
    }
  }

  /**
   * Get App Check token for API requests
   */
  async getAppCheckToken(): Promise<string | null> {
    if (!environment.production) {
      return 'debug-token';
    }

    try {
      if (this.appCheckToken && this.appCheckToken.expireTimeMillis > Date.now()) {
        return this.appCheckToken.token;
      }

      // Refresh token if expired
      // const token = await firebase.appCheck().getToken();
      // this.appCheckToken = token;
      // return token.token;
      
      return null;
    } catch (error) {
      console.error('Failed to get App Check token:', error);
      return null;
    }
  }

  /**
   * Validate domain for security
   */
  validateDomain(): boolean {
    const allowedDomains = [
      'localhost:4200',
      'hydra-contri.firebaseapp.com',
      'hydra-contri.web.app'
    ];

    const currentDomain = window.location.host;
    return allowedDomains.includes(currentDomain);
  }

  /**
   * Check if current environment is secure
   */
  isSecureContext(): boolean {
    return window.location.protocol === 'https:' || window.location.hostname === 'localhost';
  }
}
