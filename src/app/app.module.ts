import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationService } from './service/authentication.service';
import { UserService } from './service/user.service';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { AuthenticationGuard } from './guard/authentication.guard';
import { NotificationModule } from './notification.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent
  ],
  imports: [ 
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, //service to make the requests to the backend(calls)
    NotificationModule,
    FormsModule 
  ],
  providers: [NotificationModule, AuthenticationGuard, AuthenticationService, UserService, 
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}], //multi este pentru multiple instante ale clasei interceptor
  bootstrap: [AppComponent]
})
export class AppModule { }
