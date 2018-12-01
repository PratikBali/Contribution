import { Component, OnInit } from '@angular/core';
import { MyloginService } from 'app/account/mobile-otp/mylogin.service';
import { Mylogin } from 'app/account/mobile-otp/mylogin.model';

import { ActivatedRoute } from '@angular/router';
import { ActivateService } from 'app/account/activate/activate.service';
import { LoginModalService } from 'app/core';
import { ActivateComponent } from 'app/account/activate/activate.component';

@Component({
  selector: 'jhi-mobile-otp',
  templateUrl: './mobile-otp.component.html',
  styles: []
})
export class MobileOtpComponent implements OnInit {

  mylogin: Mylogin = new Mylogin();
  validnumber = 'false';
  isVerify = 'false';
  VerifyButtonClicked = 'false';
  private activateService: ActivateService;
  private loginModalService: LoginModalService;
  private route: ActivatedRoute;
  // activate: ActivateComponent = new ActivateComponent(this.activateService, this.loginModalService, this.route);

  constructor(private myloginService: MyloginService) { }

  ngOnInit() {
  }

  submit(): void {
    this.validnumber = 'true';
    this.myloginService.submit(this.mylogin)
    .subscribe(
      data => { alert('OTP sent to your Mobile Successfully'); }
    );
  }

    verify() {
      this.VerifyButtonClicked = 'true';
      if ( this.mylogin.otp === this.mylogin.verifyotp ) {
        this.isVerify = 'true';
      } else {
        this.isVerify = 'false';
      }
  }

  success() {
    // this.activate.AfterOtpValidation();
  }

}
