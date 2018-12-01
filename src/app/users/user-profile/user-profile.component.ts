import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { AccountService } from 'src/app/common/account.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  account: any;
  username: any;

  constructor(
    private auth: AuthService,
    private accountService: AccountService,
    ) { }

  ngOnInit() {
    this.accountService.account.subscribe(account => {
      this.account = account;
      console.log(this.account.email);
      console.log(this.account.name);
      console.log(this.account.picture);

      this.username = this.account.name;
    });
  }

}
