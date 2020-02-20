import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './core/auth.service';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomMaterialModule } from './custom-material.module';
// user
import { UserLoginComponent } from './users/user-login/user-login.component';
import { UserProfileComponent } from './users/user-profile/user-profile.component';
import { SettingsComponent } from './users/settings/settings.component';
// login
import { LoginModalComponent } from './layouts/login/login.component';
import { LoginModalService } from './layouts/login/login-modal.service';
// layout
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { MobileOtpComponent } from './layouts/mobile-otp/mobile-otp.component';
import { RegisterComponent } from './layouts/register/register.component';
// home
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './home/header/header.component';
import { BannerComponent } from './home/banner/banner.component';
import { MainBodyComponent } from './home/main-body/main-body.component';
import { HowDoWeDoItComponent } from './home/how-do-we-do-it/how-do-we-do-it.component';
import { PartnersComponent } from './home/partners/partners.component';
import { ServicesComponent } from './home/services/services.component';
import { ReferComponent } from './home/refer/refer.component';
import { IntroComponent } from './home/intro/intro.component';
// admin
import { PromoCodeManageComponent } from './admin/promo-code-manage/promo-code-manage.component';


@NgModule({
  declarations: [
    AppComponent,
    // user
    UserLoginComponent,
    UserProfileComponent,
    SettingsComponent,
    // layout
    NavbarComponent,
    LoginModalComponent,
    FooterComponent,
    MobileOtpComponent,
    RegisterComponent,
    // home
    HomeComponent,
    HeaderComponent,
    BannerComponent,
    MainBodyComponent,
    HowDoWeDoItComponent,
    PartnersComponent,
    ServicesComponent,
    ReferComponent,
    IntroComponent,
    // admin
    PromoCodeManageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgbModule,
    FontAwesomeModule,
    CustomMaterialModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
  ],
  exports: [LoginModalComponent],
  entryComponents: [LoginModalComponent],
  providers: [AuthService, LoginModalService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, far);
  }
}
