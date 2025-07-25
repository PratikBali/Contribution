import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Account {
  id?: string;
  email?: string;
  name?: string;
  picture?: string;
  firstName?: string;
  lastName?: string;
  activated?: boolean;
  authorities?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private readonly accountSubject = new BehaviorSubject<Account | null>(null);
  
  // Observable for components to subscribe to
  readonly account$: Observable<Account | null> = this.accountSubject.asObservable();

  constructor() {
    this.loadStoredAccount();
  }

  /**
   * Get current account value
   */
  get currentAccount(): Account | null {
    return this.accountSubject.value;
  }

  /**
   * Update account information
   */
  setAccount(account: Account | null): void {
    this.accountSubject.next(account);
    this.storeAccount(account);
  }

  /**
   * Clear account information
   */
  clearAccount(): void {
    this.accountSubject.next(null);
    this.removeStoredAccount();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.currentAccount !== null;
  }

  /**
   * Check if user has specific authority
   */
  hasAuthority(authority: string): boolean {
    const account = this.currentAccount;
    return account?.authorities?.includes(authority) ?? false;
  }

  /**
   * Check if user has any of the specified authorities
   */
  hasAnyAuthority(authorities: string[]): boolean {
    const account = this.currentAccount;
    if (!account?.authorities) {
      return false;
    }
    return authorities.some(auth => account.authorities!.includes(auth));
  }

  /**
   * Save account to session storage
   */
  private storeAccount(account: Account | null): void {
    if (account) {
      sessionStorage.setItem('contriAccount', JSON.stringify(account));
    } else {
      sessionStorage.removeItem('contriAccount');
    }
  }

  /**
   * Load account from session storage
   */
  private loadStoredAccount(): void {
    const stored = sessionStorage.getItem('contriAccount');
    if (stored) {
      try {
        const account = JSON.parse(stored) as Account;
        this.accountSubject.next(account);
      } catch (error) {
        console.error('Error parsing stored account:', error);
        sessionStorage.removeItem('contriAccount');
      }
    }
  }

  /**
   * Remove account from session storage
   */
  private removeStoredAccount(): void {
    sessionStorage.removeItem('contriAccount');
  }
}
