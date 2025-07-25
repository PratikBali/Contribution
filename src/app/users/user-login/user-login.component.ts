import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AccountService } from 'src/app/common/account.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {
  errorMessage: any;
  successMessage: string;
  registerForm: FormGroup;
  account: any;

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

  ngOnInit() {
  }

  tryRegister(value) {
    this.authService.doRegister(value)
    .then(res => {
      console.log(res);
      this.errorMessage = '';
      this.successMessage = 'Your account has been created';

      this.navigate();
    }, err => {
      console.log(err);
      this.errorMessage = err.message;
      this.successMessage = '';
    });
  }

  googleLogin() {
    this.authService.doGoogleLogin().then(account => {
      this.account = account;
      // console.log(this.account.additionalUserInfo.profile);
      // console.log(this.account.additionalUserInfo.profile.email);
      // console.log(this.account.additionalUserInfo.profile.name);
      // console.log(this.account.additionalUserInfo.profile.picture);
      this.navigate();

  });
  }

  navigate() {
    this.accountService.account.next(this.account.additionalUserInfo.profile);
    this.router.navigate(['profile']);
  }

}
