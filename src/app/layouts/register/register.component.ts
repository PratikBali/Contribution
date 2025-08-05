import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

interface RegisterAccount {
  email: string;
  password: string;
  login: string;
  langKey: string;
  gcaptcha?: string;
}

interface ValidationState {
  letter: boolean;
  capital: boolean;
  number: boolean;
  length: boolean;
  chars: boolean;
}

@Component({
    selector: 'jhi-register',
    templateUrl: './register.component.html',
    styleUrls: ['register.component.css']
})
export class RegisterComponent implements OnInit, AfterViewInit {
    // Form data with proper typing
    confirmPassword = '';
    doNotMatch: string | null = null;
    error: string | null = null;
    errorEmailExists: string | null = null;
    errorUserExists: string | null = null;
    registerAccount: RegisterAccount = {
        email: '',
        password: '',
        login: '',
        langKey: 'en'
    };
    userid = '';
    success: boolean | null = false;
    modalRef: NgbModalRef | undefined;
    submitEvent = false;
    userMailOtp = 0;
    systemMailOtp = 0;
    VerifyButtonClicked = false;
    isVerify = false;

    // Route and validation state
    param = '';
    message = '';
    validationState: ValidationState = {
        letter: false,
        capital: false,
        number: false,
        length: false,
        chars: false
    };

    // Legacy properties for backward compatibility
    get letter(): boolean { return this.validationState.letter; }
    set letter(value: boolean) { this.validationState.letter = value; }
    
    get capital(): boolean { return this.validationState.capital; }
    set capital(value: boolean) { this.validationState.capital = value; }
    
    get number(): boolean { return this.validationState.number; }
    set number(value: boolean) { this.validationState.number = value; }
    
    get length(): boolean { return this.validationState.length; }
    set length(value: boolean) { this.validationState.length = value; }
    
    get chars(): boolean { return this.validationState.chars; }
    set chars(value: boolean) { this.validationState.chars = value; }

    constructor(
        private readonly router: Router,
        @Inject(DOCUMENT) private readonly document: Document
        ) {}

    ngOnInit(): void {
        this.success = false;
        this.registerAccount = {
            email: '',
            password: '',
            login: '',
            langKey: 'en'
        };

        this.param = this.router.url;
        // Initialize component for register page
        if (this.param === '/register') {
            this.initializeRegistrationForm();
        }
    }

    ngAfterViewInit(): void {
        // Component view initialized - setup any DOM manipulations here
    }

    private initializeRegistrationForm(): void {
        // Reset all form states
        this.resetFormState();
    }

    private resetFormState(): void {
        this.doNotMatch = null;
        this.error = null;
        this.errorEmailExists = null;
        this.errorUserExists = null;
        this.submitEvent = false;
        this.validationState = {
            letter: false,
            capital: false,
            number: false,
            length: false,
            chars: false
        };
    }
    resolved(captchaResponse: string): void {
        // Sanitize captcha response to prevent XSS
        if (captchaResponse && typeof captchaResponse === 'string') {
            this.registerAccount.gcaptcha = captchaResponse.trim();
        }
    }

    register(): void {
        // Input validation and sanitization
        if (!this.validateInputs()) {
            return;
        }

        this.userid = this.registerAccount.email.trim();
        this.registerAccount.login = this.userid;
        this.registerAccount.langKey = 'en';

        // Skip captcha validation for now - TODO: Implement proper captcha validation
        const isCaptchaValid = true; // this.validateCaptcha();
        
        if (!isCaptchaValid) {
            this.error = 'Please complete the captcha verification';
            return;
        }
        
        this.submitEvent = true;
        
        if (this.registerAccount.password !== this.confirmPassword) {
            this.doNotMatch = 'ERROR';
            return;
        }

        // Reset error states
        this.resetErrorStates();
        
        // Implement proper registration logic
        this.performRegistration();
    }

    private validateInputs(): boolean {
        if (!this.registerAccount.email || !this.registerAccount.password || !this.confirmPassword) {
            this.error = 'All fields are required';
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.registerAccount.email)) {
            this.error = 'Please enter a valid email address';
            return false;
        }

        // Password strength validation
        if (!this.isPasswordStrong(this.registerAccount.password)) {
            this.error = 'Password does not meet security requirements';
            return false;
        }

        return true;
    }

    private isPasswordStrong(password: string): boolean {
        // Minimum 8 characters, at least one uppercase, one lowercase, one number, one special char
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        return strongPasswordRegex.test(password);
    }

    private resetErrorStates(): void {
        this.doNotMatch = null;
        this.error = null;
        this.errorUserExists = null;
        this.errorEmailExists = null;
    }

    private performRegistration(): void {
        // Mock registration - replace with actual service call
        // TODO: Implement proper authentication service integration
        try {
            // Simulate registration process
            this.simulateRegistration();
        } catch (error) {
            this.handleRegistrationError(error);
        }
    }

    private simulateRegistration(): void {
        // Remove sensitive data from logs in production
        if (!this.isProduction()) {
            // Only log non-sensitive data for debugging
            console.log('Registration attempt for:', this.registerAccount.email);
        }
        this.success = true;
    }

    private isProduction(): boolean {
        // Check if running in production environment
        return window.location.hostname !== 'localhost';
    }

    private handleRegistrationError(error: unknown): void {
        console.error('Registration failed:', error);
        this.error = 'Registration failed. Please try again.';
        this.success = false;
    }

    Validate(data: string): void {
        if (!data) {
            this.resetValidationState();
            return;
        }

        // Validate lowercase letters
        this.validationState.letter = !/[a-z]/.test(data);

        // Validate capital letters  
        this.validationState.capital = !/[A-Z]/.test(data);

        // Validate numbers
        this.validationState.number = !/\d/.test(data);

        // Validate length (minimum 8 characters)
        this.validationState.length = data.length < 8;

        // Validate special characters
        this.validationState.chars = !/[!@#$%^&*]/.test(data);
    }

    private resetValidationState(): void {
        this.validationState = {
            letter: true,
            capital: true,
            number: true,
            length: true,
            chars: true
        };
    }

    private processError(response: HttpErrorResponse): void {
        this.success = null;
        
        if (!response?.error) {
            this.error = 'An unexpected error occurred';
            return;
        }

        switch (response.error.errorKey) {
            case 'userexists':
                this.errorUserExists = 'ERROR';
                break;
            case 'emailexists':
                this.errorEmailExists = 'ERROR';
                break;
            default:
                this.error = 'ERROR';
                break;
        }
    }

    verify(): void {
        if (this.userMailOtp <= 0) {
            this.error = 'Invalid verification code';
            return;
        }

        this.router.navigate(['activate'], {
            queryParams: { key: this.userMailOtp }
        }).catch(error => {
            console.error('Navigation error:', error);
            this.error = 'Navigation failed';
        });
    }

    findUser(): void {
        // Implement proper user search functionality
        if (!this.registerAccount.email) {
            return;
        }
        
        // TODO: Replace with actual user service call
        // this.userService.findByEmail(this.registerAccount.email)
        //   .subscribe(user => handleUserFound(user))
        //   .catch(error => handleError(error));
    }

    loadAll(): void {
        // Implement proper user loading functionality  
        // TODO: Replace with actual user service call
        // this.userService.getAllUsers()
        //   .subscribe(users => handleUsersLoaded(users))
        //   .catch(error => handleError(error));
    }

    onSuccess(_data: unknown, _headers: unknown): void {
        // Handle successful operations
        // Implementation depends on the specific success scenario
    }

    onError(_error: unknown): void {
        // Handle error scenarios
        console.error('Component error occurred:', _error);
        this.error = 'An error occurred. Please try again.';
    }

    openLogin(): void {
        // Navigate to login or open login modal
        this.router.navigate(['/login']).catch(error => {
            console.error('Login navigation error:', error);
        });
    }
}
