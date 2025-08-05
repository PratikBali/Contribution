import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, timer } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../core/auth.service';
import { environment } from '../../environments/environment';

export interface SecurityMetrics {
  failedLoginAttempts: number;
  lastFailedAttempt: number;
  isLocked: boolean;
  lockoutExpiry: number;
  suspiciousActivity: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  private readonly securityMetricsSubject = new BehaviorSubject<SecurityMetrics>({
    failedLoginAttempts: 0,
    lastFailedAttempt: 0,
    isLocked: false,
    lockoutExpiry: 0,
    suspiciousActivity: false
  });

  readonly securityMetrics$ = this.securityMetricsSubject.asObservable();

  constructor(private authService: AuthService) {
    this.initializeSecurityMonitoring();
  }

  /**
   * Initialize security monitoring
   */
  private initializeSecurityMonitoring(): void {
    // Monitor authentication state changes
    this.authService.getAuthState().subscribe(user => {
      if (user) {
        this.resetSecurityMetrics();
        this.logSecurityEvent('successful_login', { userId: user.uid });
      }
    });

    // Clean up expired lockouts
    timer(60000, 60000).subscribe(() => {
      this.cleanupExpiredLockouts();
    });
  }

  /**
   * Record failed login attempt
   */
  recordFailedLoginAttempt(identifier: string): void {
    const currentMetrics = this.securityMetricsSubject.value;
    const newFailedAttempts = currentMetrics.failedLoginAttempts + 1;
    const now = Date.now();

    const updatedMetrics: SecurityMetrics = {
      ...currentMetrics,
      failedLoginAttempts: newFailedAttempts,
      lastFailedAttempt: now,
      isLocked: newFailedAttempts >= environment.security.maxLoginAttempts,
      lockoutExpiry: newFailedAttempts >= environment.security.maxLoginAttempts 
        ? now + environment.security.lockoutDuration 
        : 0,
      suspiciousActivity: newFailedAttempts >= 3
    };

    this.securityMetricsSubject.next(updatedMetrics);
    
    this.logSecurityEvent('failed_login_attempt', {
      identifier,
      attemptCount: newFailedAttempts,
      isLocked: updatedMetrics.isLocked
    });

    // Store in localStorage for persistence
    localStorage.setItem('security_metrics', JSON.stringify(updatedMetrics));
  }

  /**
   * Check if account is currently locked
   */
  isAccountLocked(): Observable<boolean> {
    return this.securityMetrics$.pipe(
      map(metrics => {
        if (!metrics.isLocked) return false;
        
        const now = Date.now();
        if (now > metrics.lockoutExpiry) {
          // Lockout expired, reset
          this.resetSecurityMetrics();
          return false;
        }
        
        return true;
      })
    );
  }

  /**
   * Get remaining lockout time in milliseconds
   */
  getRemainingLockoutTime(): Observable<number> {
    return this.securityMetrics$.pipe(
      map(metrics => {
        if (!metrics.isLocked) return 0;
        
        const remaining = metrics.lockoutExpiry - Date.now();
        return Math.max(0, remaining);
      })
    );
  }

  /**
   * Reset security metrics (on successful login)
   */
  private resetSecurityMetrics(): void {
    const resetMetrics: SecurityMetrics = {
      failedLoginAttempts: 0,
      lastFailedAttempt: 0,
      isLocked: false,
      lockoutExpiry: 0,
      suspiciousActivity: false
    };

    this.securityMetricsSubject.next(resetMetrics);
    localStorage.removeItem('security_metrics');
  }

  /**
   * Clean up expired lockouts
   */
  private cleanupExpiredLockouts(): void {
    const currentMetrics = this.securityMetricsSubject.value;
    
    if (currentMetrics.isLocked && Date.now() > currentMetrics.lockoutExpiry) {
      this.resetSecurityMetrics();
    }
  }

  /**
   * Log security events (for monitoring and audit)
   */
  private logSecurityEvent(eventType: string, data: any): void {
    if (!environment.security.enableLogging) return;

    const logEntry = {
      timestamp: new Date().toISOString(),
      eventType,
      data,
      userAgent: navigator.userAgent,
      ip: 'client-side', // Would be filled by server
      domain: window.location.hostname
    };

    console.log('Security Event:', logEntry);
    
    // In production, send to security monitoring service
    if (environment.production) {
      // this.sendToSecurityService(logEntry);
    }
  }

  /**
   * Validate session integrity
   */
  async validateSession(): Promise<boolean> {
    try {
      const user = await this.authService.getCurrentUser().pipe(take(1)).toPromise();
      
      if (!user) return false;
      
      // Check token expiry
      const token = await user.getIdToken();
      if (!token) return false;
      
      // Additional security checks
      const tokenResult = await user.getIdTokenResult();
      
      // Check if token is too old
      const tokenAge = Date.now() - new Date(tokenResult.issuedAtTime).getTime();
      if (tokenAge > environment.security.sessionTimeout) {
        return false;
      }
      
      return true;
    } catch (error) {
      this.logSecurityEvent('session_validation_failed', { error: error.message });
      return false;
    }
  }

  /**
   * Get security recommendations for the user
   */
  getSecurityRecommendations(): Observable<string[]> {
    return this.securityMetrics$.pipe(
      switchMap(async (metrics) => {
        const recommendations: string[] = [];
        
        if (metrics.failedLoginAttempts > 0) {
          recommendations.push('Consider enabling two-factor authentication for enhanced security');
        }
        
        if (metrics.suspiciousActivity) {
          recommendations.push('Review recent login activity and change your password if needed');
        }
        
        // Check user's authentication methods
        try {
          const user = await this.authService.getCurrentUser().pipe(take(1)).toPromise();
          if (user && user.providerData.length === 1) {
            recommendations.push('Add additional sign-in methods for account recovery');
          }
        } catch (error) {
          // Ignore error
        }
        
        if (!environment.security.enableAppCheck && environment.production) {
          recommendations.push('App Check is recommended for enhanced security');
        }
        
        return recommendations;
      })
    );
  }
}
