import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/common/account.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LoginModalService } from '../login/login-modal.service';
import { AuthService } from 'src/app/core/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  loggedin: boolean;
  admin_role: boolean;
  isNavbarCollapsed: boolean;
  modalRef: NgbModalRef;
  FirstName: string;
  FullName: string;
  account: any;

  constructor(
    private accountService: AccountService,
    private loginModalService: LoginModalService,
    private authService: AuthService,
    ) {
    }

  ngOnInit() {
    this.admin_role = false;
    this.loggedin = false;
    this.isNavbarCollapsed = true;

    const sessionState = sessionStorage && sessionStorage.contriState;
    if (sessionState) {
      this.setState(JSON.parse(sessionState));
    }

    this.accountService.account.subscribe(account => {
      if (account) {
        this.account = account;
        sessionStorage.setItem('contriState', JSON.stringify(this.account.additionalUserInfo));
        this.setState(this.account.additionalUserInfo);
      } else {
        this.logout();
      }
    });
  }

  setState(sessionState: any) {
    if (sessionState) {
      this.loggedin = true;
      this.FirstName =  sessionState.profile && sessionState.profile.given_name;
      this.FullName =  sessionState.profile && sessionState.profile.name;
    } else {
      this.logout();
    }
  }

  collapseNavbar() {
    this.isNavbarCollapsed = true;
  }

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  toggle() {

  }

  contact() {

  }

  login() {
    this.collapseNavbar();
    this.modalRef = this.loginModalService.open();
  }

  logout() {
    this.loggedin = false;
    this.admin_role = false;
    this.collapseNavbar();
    this.authService.logout();
  }
}
