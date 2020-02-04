import { Component, AfterViewInit, Renderer, ElementRef } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth.service';
import { AccountService } from 'src/app/common/account.service';
// import { JhiEventManager } from 'ng-jhipster';

// import { LoginService } from 'app/core/login/login.service';
// import { StateStorageService } from 'app/core/auth/state-storage.service';
// import { CommonSidebarService } from 'app/pratik/common/sidebar.service';
// import { SuccessService } from 'app/success/success.service';
// import { AccountService, Principal } from 'app/core';
// import { PlanService } from 'app/pratik/common/plan.service';
// import { CookieService } from 'ngx-cookie';

@Component({
    selector: 'app-login-modal',
    templateUrl: './login.component.html'
})
export class LoginModalComponent implements AfterViewInit {
    authenticationError: boolean;
    password: string;
    rememberMe: boolean;
    username: string;
    credentials: any;
    flag = false;
    uid;
    isPlan;
    isPayment;

    PaymentArray: any = [];
    route: any;
    admin: any;
    account: any;

    constructor(
        private renderer: Renderer,
        private elementRef: ElementRef,
        private router: Router,
        public activeModal: NgbActiveModal,
        private authService: AuthService,
        private accountService: AccountService,
    ) {
        this.credentials = {};
    }

    ngAfterViewInit() {
        setTimeout(() => this.renderer.invokeElementMethod(this.elementRef.nativeElement.querySelector('#username'), 'focus', []), 0);
    }

    cancel() {
        this.credentials = {
            username: null,
            password: null,
            rememberMe: true
        };
        this.authenticationError = false;
        this.activeModal.dismiss('cancel');
    }

    getUserid() {

    }

    CheckPlanSelected() {

    }

    CheckPayment() {

    }

    routing() {
        const url = this.router.url;
    }

    login() {
        this.credentials = {
            username: this.username,
            password: this.password,
            rememberMe: this.rememberMe
        };
        this.authService.doEmailLogin(this.credentials)
        .then(response => {
            this.account = response;
            this.authenticationError = false;
            this.tellProject(this.account.user.uid);
            this.activeModal.dismiss('login success');
        })
        .catch(error => {
            this.authenticationError = true;
              // Handle Errors here.
              const errorCode = error.code;
              const errorMessage = error.message;
              if (errorCode === 'auth/wrong-password') {
                alert('Wrong password.');
              } else
              if (errorCode === 'auth/invalid-email') {
                alert('Wrong email.');
              } else {
                alert(errorMessage);
              }
        });
    }

    emailLogin() {
        this.authService.doGoogleLogin()
        .then(response => {
            this.account = response;
            this.authenticationError = false;
            this.tellProject(this.account.user.uid);
            this.activeModal.dismiss('login success');
        })
        .catch(error => {
            this.authenticationError = true;
        });
    }

    googleLogin() {
        this.authService.doGoogleLogin()
        .then(response => {
            this.account = response;
            this.authenticationError = false;
            this.tellProject(this.account);
            this.activeModal.dismiss('login success');
        })
        .catch(error => {
            this.authenticationError = true;
        });
    }

    facebookLogin() {
        alert('not available in this version please wait for next version');
    }

    linkedinLogin() {
        alert('not available in this version please wait for next version');

    }

    twitterLogin() {
        alert('not available in this version please wait for next version');

    }

    tellProject(uid) {
        this.accountService.account.next(uid);
    }

    register() {
        this.activeModal.dismiss('to state register');
        this.router.navigate(['/register']);
    }

    requestResetPassword() {
        this.activeModal.dismiss('to state requestReset');
        this.router.navigate(['/reset', 'request']);
    }
}
