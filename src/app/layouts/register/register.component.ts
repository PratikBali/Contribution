import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

// import { Register } from 'app/account/register/register.service';

// import { UserMgmtComponent } from 'app/admin';
// import { User, LoginModalService } from '../../core';
import { Router } from '@angular/router';

@Component({
    selector: 'jhi-register',
    templateUrl: './register.component.html',
    styleUrls: ['register.component.css']
})
export class RegisterComponent implements OnInit, AfterViewInit {
    confirmPassword: string = '';
    doNotMatch: string | null = '';
    error: string | null = '';
    errorEmailExists: string | null = '';
    errorUserExists: string | null = '';
    registerAccount: Record<string, unknown> = {};
    userid: string = '';
    success: boolean | null = false;
    modalRef: NgbModalRef | undefined;
    submitEvent = false;
    userMailOtp: number = 0;
    systemMailOtp: number = 0;
    VerifyButtonClicked = false;
    isVerify = false;

    // userMgmt: UserMgmtComponent;
    // users: User[];
    param: string = '';
    message: string = '';
    letter: boolean = false;
    capital: boolean = false;
    number: boolean = false;
    length: boolean = false;
    chars: boolean = false;

    constructor(
        // private loginModalService: LoginModalService,
        // private registerService: Register,
        private router: Router,
        @Inject(DOCUMENT) private document: Document
        ) {}

    ngOnInit(): void {
        this.success = false;
        this.registerAccount = {};

        this.param = this.router.url;
        if (this.param === '/register') {
            // this.registerService.isRegisterPage.next(true);
        } else {
            // this.registerService.isRegisterPage.next(false);
        }
    }

    ngAfterViewInit(): void {}
    resolved(captchaResponse: string): void {
        this.registerAccount.gcaptcha = captchaResponse;
    }

    register(): void {
        this.userid = this.registerAccount.email as string;
        this.registerAccount.login = this.userid;
        // const resp = grecaptcha.getResponse();
        const resp = '';
        const x = resp.length;
        if (x === 0) {
            (this.document.getElementById('g-recaptcha-error') as HTMLElement).innerHTML = '<span style = "color:red;">Please Verify the Captcha</span>';
        } else {
            this.registerAccount.gcaptcha = resp;
            this.submitEvent = true;
            if (this.registerAccount.password !== this.confirmPassword) {
                this.doNotMatch = 'ERROR';
            } else {
                this.doNotMatch = null;
                this.error = null;
                this.errorUserExists = null;
                this.errorEmailExists = null;
                this.registerAccount.langKey = 'en';
                // this.registerService.save(this.registerAccount).subscribe(
                //     () => {
                //         this.success = true;
                //     },
                //     response => {
                //         this.processError(response);
                //     }
                // );
            }
        }
    }

    Validate(data: string): void {
        // Validate lowercase letters
        const lowerCaseLetters = /[a-z]/g;
        if (data.match(lowerCaseLetters)) {
            this.letter = false;
        } else {
            this.letter = true;
        }

        // Validate capital letters
        const upperCaseLetters = /[A-Z]/g;
        if (data.match(upperCaseLetters)) {
            this.capital = false;
        } else {
            this.capital = true;
        }

        // Validate numbers
        const numbers = /[0-9]/g;
        if (data.match(numbers)) {
            this.number = false;
        } else {
            this.number = true;
        }

        // Validate special chars
        const chars = /[!@#$%^&*]/g;
        if (data.match(chars)) {
            this.chars = false;
        } else {
            this.chars = true;
        }
    }

    private processError(response: HttpErrorResponse) {
        this.success = null;
        // if ( response.status === 400 && response.error.type === LOGIN_ALREADY_USED_TYPE ) {
        if (response.error.errorKey === 'userexists') {
            this.errorUserExists = 'ERROR';
            // } else if ( response.status === 400 && response.error.type === EMAIL_ALREADY_USED_TYPE ) {
        } else if (response.error.errorKey === 'emailexists') {
            this.errorEmailExists = 'ERROR';
        } else {
            this.error = 'ERROR';
            // this.success = true;
        }
    }

    verify(): void {
        this.router.navigate(['activate'], {
            queryParams: { key: this.userMailOtp }
        });
    }
    findUser(): void {
        this.loadAll();
        // for (const user of this.users) {
        //     if (user.email === this.registerAccount.email) {
        //         // this.userMgmt.setActive(user, true);
        //     }
        // }
    }

    loadAll(): void {
        // this.registerService.getUsers().subscribe(data => (this.users = data));
        // this.userMgmt.loadAll();
    }
    onSuccess(_data: unknown, _headers: unknown): void {
        // this.users = data;
    }
    onError(_error: unknown): void {}

    openLogin(): void {
        // this.modalRef = this.loginModalService.open();
    }
}
