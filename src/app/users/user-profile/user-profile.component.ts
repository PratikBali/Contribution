import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { AccountService } from 'src/app/common/account.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  account: { email?: string; name?: string; picture?: string } | null = null;
  username: string = '';

  constructor(
    private auth: AuthService,
    private accountService: AccountService,
    ) { }

  ngOnInit(): void {
    this.accountService.account$.subscribe(account => {
      this.account = account;
      if (this.account) {
        this.username = this.account.name || '';
      }
    });
  }

}
