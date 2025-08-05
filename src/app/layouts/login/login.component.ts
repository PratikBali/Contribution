import { Component, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
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
    authenticationError: boolean = false;
    errorMessage: string = '';
    password: string = '';
    rememberMe: boolean = false;
    username: string = '';
    credentials: { username: string; password: string; rememberMe?: boolean } = { username: '', password: '' };
    flag = false;
    uid: string = '';
    isPlan: boolean = false;
    isPayment: boolean = false;

    PaymentArray: string[] = [];
    route: string = '';
    admin: boolean = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    account: any = null;

    constructor(
        private renderer: Renderer2,
        private elementRef: ElementRef,
        private router: Router,
        public activeModal: NgbActiveModal,
        private authService: AuthService,
        private accountService: AccountService,
    ) {
        this.credentials = { username: '', password: '' };
    }

    ngAfterViewInit(): void {
        setTimeout(() =>
            this.renderer.selectRootElement(this.elementRef.nativeElement.querySelector('#username'), true), 0);
    }

    cancel(): void {
        this.credentials = {
            username: '',
            password: '',
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

    routing(): void {
        // Method implementation pending
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
            this.errorMessage = '';
            
            // Set account with proper user data
            if (response.user) {
                const userAccount = {
                    id: response.user.uid,
                    email: response.user.email || '',
                    name: response.user.displayName || '',
                    picture: response.user.photoURL || '',
                    firstName: response.user.displayName?.split(' ')[0] || '',
                    lastName: response.user.displayName?.split(' ').slice(1).join(' ') || '',
                    activated: response.user.emailVerified
                };
                this.accountService.setAccount(userAccount);
            }
            
            this.activeModal.dismiss('login success');
        })
        .catch(error => {
            this.authenticationError = true;
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {
                this.errorMessage = 'Wrong password.';
            } else if (errorCode === 'auth/invalid-email') {
                this.errorMessage = 'Wrong email.';
            } else {
                this.errorMessage = errorMessage;
            }
        });
    }

    // This method seems to be for Google login based on the implementation
    // Consider renaming to avoid confusion
    emailLogin() {
        this.authService.doGoogleLogin()
        .then(response => {
            this.account = response;
            this.authenticationError = false;
            this.errorMessage = '';
            
            // Set account with proper user data
            if (response.user) {
                const userAccount = {
                    id: response.user.uid,
                    email: response.user.email || '',
                    name: response.user.displayName || '',
                    picture: response.user.photoURL || '',
                    firstName: response.user.displayName?.split(' ')[0] || '',
                    lastName: response.user.displayName?.split(' ').slice(1).join(' ') || '',
                    activated: response.user.emailVerified
                };
                this.accountService.setAccount(userAccount);
            }
            
            this.activeModal.dismiss('login success');
        })
        .catch(error => {
            this.authenticationError = true;
            this.errorMessage = error.message || 'Google login failed. Please try again.';
        });
    }

    googleLogin() {
        this.authService.doGoogleLogin()
        .then(response => {
            this.account = response;
            this.authenticationError = false;
            this.errorMessage = '';
            
            // Set account with proper user data
            if (response.user) {
                const userAccount = {
                    id: response.user.uid,
                    email: response.user.email || '',
                    name: response.user.displayName || '',
                    picture: response.user.photoURL || '',
                    firstName: response.user.displayName?.split(' ')[0] || '',
                    lastName: response.user.displayName?.split(' ').slice(1).join(' ') || '',
                    activated: response.user.emailVerified
                };
                this.accountService.setAccount(userAccount);
            }
            
            this.activeModal.dismiss('login success');
        })
        .catch(error => {
            this.authenticationError = true;
            this.errorMessage = error.message || 'Google login failed. Please try again.';
        });
    }

    facebookLogin(): void {
        this.errorMessage = 'Feature not available in this version. Please wait for next version.';
    }

    linkedinLogin(): void {
        this.errorMessage = 'Feature not available in this version. Please wait for next version.';
    }

    twitterLogin(): void {
        this.errorMessage = 'Feature not available in this version. Please wait for next version.';
    }

    tellProject(uid: string): void {
        // Convert string to Account object format
        const account = { id: uid, email: uid };
        this.accountService.setAccount(account);
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
