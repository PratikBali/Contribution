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
  account: any;
  loggedin: boolean;
  admin_role: boolean;
  isNavbarCollapsed: boolean;
  modalRef: NgbModalRef;
  FirstName;
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
    this.accountService.account.subscribe(account => {
      if (account !== false) {
        this.account = account;
        this.loggedin = true;
        console.log(this.account);
      } else {
        this.account = null;
        this.loggedin = false;
        this.admin_role = false;
        console.log(this.account);
      }
    });
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
    this.collapseNavbar();
    this.authService.logout();
    this.accountService.account.next(false);
    // this.authenticationError = false;
  }
}
