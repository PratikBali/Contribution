import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserLoginComponent } from './users/user-login/user-login.component';
import { UserProfileComponent } from './users/user-profile/user-profile.component';
import { AuthService } from './core/auth.service';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
library.add(fas, far);
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CustomMaterialModule } from './custom-material.module';
// login
import { LoginModalComponent } from './layouts/login/login.component';
import { LoginModalService } from './layouts/login/login-modal.service';
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

@NgModule({
  declarations: [
    AppComponent,
    // user
    UserLoginComponent,
    UserProfileComponent,
    // layout
    NavbarComponent,
    LoginModalComponent,
    // home
    HomeComponent,
    HeaderComponent,
    BannerComponent,
    MainBodyComponent,
    HowDoWeDoItComponent,
    PartnersComponent,
    ServicesComponent,
    ReferComponent,
    IntroComponent
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
export class AppModule { }
