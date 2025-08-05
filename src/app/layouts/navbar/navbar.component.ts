import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/common/account.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LoginModalService } from '../login/login-modal.service';
import { AuthService } from 'src/app/core/auth.service';
import { 
  faUser, 
  faCog, 
  faBars, 
  faEllipsisV, 
  faHome, 
  faConciergeBell, 
  faHandshake, 
  faUserPlus, 
  faTasks, 
  faClock, 
  faSignOutAlt,
  faSignInAlt 
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  loggedin: boolean = false;
  admin_role: boolean = false;
  isNavbarCollapsed: boolean = true;
  modalRef: NgbModalRef | undefined;
  FirstName: string = '';
  FullName: string = '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  account: any = null;

  // FontAwesome icons
  faUser = faUser;
  faCog = faCog;
  faBars = faBars;
  faEllipsisV = faEllipsisV;
  faHome = faHome;
  faConciergeBell = faConciergeBell;
  faHandshake = faHandshake;
  faUserPlus = faUserPlus;
  faTasks = faTasks;
  faClock = faClock;
  faSignOutAlt = faSignOutAlt;
  faSignInAlt = faSignInAlt;

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

    this.accountService.account$.subscribe(account => {
      if (account) {
        this.account = account;
        sessionStorage.setItem('contriState', JSON.stringify(this.account.additionalUserInfo));
        this.setState(this.account.additionalUserInfo);
      } else {
        this.logout();
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setState(sessionState: any): void {
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
    this.authService.doLogout();
  }
}
