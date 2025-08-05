import { Injectable } from '@angular/core';
import { Observable, throwError, ReplaySubject } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

export interface RegisterRequest {
  email: string;
  password: string;
  login: string;
  langKey: string;
  gcaptcha?: string;
}


export interface RegisterResponse {
  success: boolean;
  message?: string;
  errors?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class Register {
  isRegisterPage = new ReplaySubject(0);
  private readonly apiUrl = '/api/register'; // Update with your actual API endpoint
  private readonly timeout = 30000; // 30 second timeout

  constructor(private readonly http: HttpClient) {}

  /**
   * Register a new user with security validations
   * @param registerData - User registration data
   * @returns Observable of registration response
   */
  save(registerData: RegisterRequest): Observable<RegisterResponse> {
    // Validate input data
    if (!this.validateRegisterData(registerData)) {
      return throwError(() => new Error('Invalid registration data'));
    }

    // Sanitize data
    const sanitizedData = this.sanitizeRegisterData(registerData);

    // Set security headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    });

    return this.http.post<RegisterResponse>(this.apiUrl, sanitizedData, { headers })
      .pipe(
        timeout(this.timeout),
        map(response => this.validateResponse(response)),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * Send activation email
   * @param email - Email address to send activation to
   * @returns Observable of email send response
   */
  sendMail(email: { email: string }): Observable<{ success: boolean }> {
    if (!this.isValidEmail(email.email)) {
      return throwError(() => new Error('Invalid email format'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    });

    const sanitizedEmail = { email: email.email.trim().toLowerCase() };

    return this.http.post<{ success: boolean }>('/api/mail/send-mail', sanitizedEmail, { headers })
      .pipe(
        timeout(15000),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * Check if email already exists
   * @param email - Email address to check
   * @returns Observable boolean indicating if email exists
   */
  checkEmailExists(email: string): Observable<boolean> {
    if (!this.isValidEmail(email)) {
      return throwError(() => new Error('Invalid email format'));
    }

    const headers = new HttpHeaders({
      'X-Requested-With': 'XMLHttpRequest'
    });

    return this.http.get<{exists: boolean}>(`${this.apiUrl}/check-email/${encodeURIComponent(email)}`, { headers })
      .pipe(
        timeout(10000),
        map(response => response.exists),
        catchError(error => this.handleError(error))
      );
  }

  /**
   * Activate user account
   * @param key - Activation key
   * @returns Observable of activation response
   */
  activate(key: string): Observable<{ success: boolean }> {
    if (!key || key.length < 10) {
      return throwError(() => new Error('Invalid activation key'));
    }

    const headers = new HttpHeaders({
      'X-Requested-With': 'XMLHttpRequest'
    });

    return this.http.get<{ success: boolean }>(`/api/activate?key=${encodeURIComponent(key)}`, { headers })
      .pipe(
        timeout(15000),
        catchError(error => this.handleError(error))
      );
  }

  private validateRegisterData(data: RegisterRequest): boolean {
    return !!(
      data.email &&
      data.password &&
      data.login &&
      data.langKey &&
      this.isValidEmail(data.email) &&
      this.isValidPassword(data.password)
    );
  }

  private sanitizeRegisterData(data: RegisterRequest): RegisterRequest {
    return {
      email: data.email.trim().toLowerCase(),
      password: data.password, // Don't trim passwords as they might contain intentional spaces
      login: data.login.trim().toLowerCase(),
      langKey: data.langKey.trim(),
      gcaptcha: data.gcaptcha?.trim()
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254; // RFC 5321 limit
  }

  private isValidPassword(password: string): boolean {
    // Minimum 8 characters, max 128 to prevent DoS
    if (password.length < 8 || password.length > 128) {
      return false;
    }

    // Must contain at least one lowercase, uppercase, digit, and special character
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

    return hasLower && hasUpper && hasDigit && hasSpecial;
  }

  private validateResponse(response: RegisterResponse): RegisterResponse {
    if (!response || typeof response.success !== 'boolean') {
      throw new Error('Invalid server response');
    }
    return response;
  }

  private handleError(error: HttpErrorResponse | Error): Observable<never> {
    let errorMessage = 'Operation failed';

    if (error instanceof HttpErrorResponse) {
      // Server-side error
      if (error.status === 400) {
        errorMessage = 'Invalid request data';
      } else if (error.status === 409) {
        errorMessage = 'Email already exists';
      } else if (error.status === 429) {
        errorMessage = 'Too many requests. Please try again later';
      } else if (error.status >= 500) {
        errorMessage = 'Server error. Please try again later';
      }
    } else {
      // Client-side error
      errorMessage = error.message || 'Operation failed';
    }

    return throwError(() => new Error(errorMessage));
  }
}
