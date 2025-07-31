import { Component, OnInit } from '@angular/core';

// import { Principal, AccountService } from 'app/core';

@Component({
    selector: 'jhi-settings',
    templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {
    error: string = '';
    success: string = '';
    settingsAccount: Record<string, unknown> = {};
    languages: string[] = [];

    // constructor(private account: AccountService, private principal: Principal) {}

    ngOnInit(): void {
        // Debug logging removed for strict mode
        // this.principal.identity().then(account => {
        //     this.settingsAccount = this.copyAccount(account);
        // });
    }

    save() {
        // this.account.save(this.settingsAccount).subscribe(
        //     () => {
        //         this.error = null;
        //         this.success = 'OK';
        //         console.log('calling account');

        //         this.principal.identity(true).then(account => {
        //             this.settingsAccount = this.copyAccount(account);
        //         });
        //     },
        //     () => {
        //         this.success = null;
        //         this.error = 'ERROR';
        //     }
        // );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    copyAccount(_account: Record<string, unknown>): Record<string, unknown> {
        return {};
    }
}
