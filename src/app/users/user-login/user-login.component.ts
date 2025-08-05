import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { AccountService } from 'src/app/common/account.service';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {
  errorMessage: string = '';
  successMessage: string = '';
  registerForm: FormGroup;
  account: firebase.auth.UserCredential | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private accountService: AccountService,
    ) {
      this.registerForm = new FormGroup({
        email: new FormControl(),
        password: new FormControl(),
     });
    }

  ngOnInit(): void {
  }

  tryRegister(value: { email: string; password: string }): void {
    this.authService.doRegister(value)
    .then(_res => {
      this.errorMessage = '';
      this.successMessage = 'Your account has been created';
      this.navigate();
    }, err => {
      this.errorMessage = err.message;
      this.successMessage = '';
    });
  }

  googleLogin(): void {
    this.authService.doGoogleLogin().then(account => {
      this.account = account;
      this.errorMessage = '';
      this.successMessage = 'Successfully logged in with Google';
      
      // Set account with proper user data
      if (account.user) {
        const userAccount = {
          id: account.user.uid,
          email: account.user.email || '',
          name: account.user.displayName || '',
          picture: account.user.photoURL || '',
          firstName: account.user.displayName?.split(' ')[0] || '',
          lastName: account.user.displayName?.split(' ').slice(1).join(' ') || '',
          activated: account.user.emailVerified
        };
        this.accountService.setAccount(userAccount);
      }
      
      this.navigate();
    }).catch(error => {
      this.errorMessage = error.message || 'Google login failed. Please try again.';
      this.successMessage = '';
    });
  }

  navigate(): void {
    if (this.account?.user) {
      // Account is already set in the service, just navigate
      this.router.navigate(['profile']);
    } else {
      // Fallback navigation to home if no account data
      this.router.navigate(['/']);
    }
  }

}
