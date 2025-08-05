import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { GoogleLoginService, GoogleLoginState } from '../layouts/login/google-login.service';
import { AuthService } from '../core/auth.service';
import { AccountService, Account } from '../common/account.service';

@Component({
  selector: 'app-google-login-test',
  template: `
    <div class="google-login-test">
      <h3>Google Login Test Component</h3>
      
      <!-- Login State Display -->
      <div class="login-state" *ngIf="loginState">
        <p><strong>Loading:</strong> {{ loginState.isLoading }}</p>
        <p><strong>Success:</strong> {{ loginState.success }}</p>
        <p><strong>Error:</strong> {{ loginState.error || 'None' }}</p>
      </div>

      <!-- Current User Display -->
      <div class="user-info" *ngIf="currentAccount">
        <h4>Current User:</h4>
        <p><strong>Name:</strong> {{ currentAccount.name }}</p>
        <p><strong>Email:</strong> {{ currentAccount.email }}</p>
        <p><strong>ID:</strong> {{ currentAccount.id }}</p>
        <img *ngIf="currentAccount.picture" [src]="currentAccount.picture" alt="Profile" width="50" height="50">
      </div>

      <!-- Login Controls -->
      <div class="login-controls">
        <button 
          (click)="performGoogleLogin()" 
          [disabled]="loginState?.isLoading"
          class="btn btn-primary">
          {{ loginState?.isLoading ? 'Logging in...' : 'Login with Google' }}
        </button>
        
        <button 
          (click)="logout()" 
          *ngIf="currentAccount"
          class="btn btn-secondary">
          Logout
        </button>
        
        <button 
          (click)="checkStatus()" 
          class="btn btn-info">
          Check Status
        </button>
      </div>

      <!-- Troubleshooting -->
      <div class="troubleshooting" *ngIf="loginState?.error">
        <h4>Troubleshooting Tips:</h4>
        <ul>
          <li *ngFor="let tip of troubleshootingTips">{{ tip }}</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .google-login-test {
      padding: 20px;
      max-width: 600px;
      margin: 20px auto;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    .login-controls button {
      margin: 5px;
    }
    .user-info {
      background-color: #f5f5f5;
      padding: 15px;
      border-radius: 5px;
      margin: 15px 0;
    }
    .login-state {
      background-color: #e3f2fd;
      padding: 10px;
      border-radius: 5px;
      margin: 10px 0;
    }
    .troubleshooting {
      background-color: #fff3cd;
      padding: 15px;
      border-radius: 5px;
      margin: 15px 0;
    }
  `]
})
export class GoogleLoginTestComponent implements OnInit, OnDestroy {
  loginState: GoogleLoginState | null = null;
  currentAccount: Account | null = null;
  troubleshootingTips: string[] = [];
  
  private subscriptions: Subscription[] = [];

  constructor(
    private googleLoginService: GoogleLoginService,
    private authService: AuthService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    // Subscribe to login state changes
    this.subscriptions.push(
      this.googleLoginService.loginState$.subscribe(state => {
        this.loginState = state;
        if (state.error) {
          this.troubleshootingTips = this.googleLoginService.getTroubleshootingTips();
        }
      })
    );

    // Subscribe to account changes
    this.subscriptions.push(
      this.accountService.account$.subscribe(account => {
        this.currentAccount = account;
      })
    );

    // Initial status check
    this.checkStatus();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  async performGoogleLogin(): Promise<void> {
    try {
      await this.googleLoginService.performGoogleLogin();
      // Success is handled by the subscription
    } catch (error) {
      // Error is handled by the subscription
      console.warn('Google login failed:', error);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.authService.doLogout();
      this.accountService.clearAccount();
      this.googleLoginService.resetLoginState();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  async checkStatus(): Promise<void> {
    try {
      const isGoogleUser = await this.googleLoginService.isGoogleUserLoggedIn();
      const profile = await this.googleLoginService.getGoogleUserProfile();
      
      console.log('Google Login Status:', {
        isGoogleUser,
        profile,
        currentAccount: this.currentAccount
      });
    } catch (error) {
      console.error('Status check failed:', error);
    }
  }
}
