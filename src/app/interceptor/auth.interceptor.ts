import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../service/authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) {}

  intercept(httpRequest: HttpRequest<any>, httpHandler: HttpHandler): Observable<HttpEvent<any>> { //let the requests for login/register/resetpassword do its course, don't make any changes(we dont need jwt for this)
    if (httpRequest.url.includes(`${this.authenticationService.host}/user/login`)) { //if the request url has the pattern "/user/login" just pass the request over
      return httpHandler.handle(httpRequest);
    }
    if (httpRequest.url.includes(`${this.authenticationService.host}/user/register`)) { //if the request url has the pattern "/user/register" just pass the request over
      return httpHandler.handle(httpRequest);
    }

    //For all other requests, the interceptor modifies the HTTP request by adding an authorization token to the request headers. 
    this.authenticationService.loadToken();
    const token = this.authenticationService.getToken();
    const request = httpRequest.clone({setHeaders: { Authorization: `Bearer ${token}`}}); //modify the clone of the httpRequest
    return httpHandler.handle(request);
  }
}
