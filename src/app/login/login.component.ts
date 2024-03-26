import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthenticationService } from '../service/authentication.service';
import { Router } from '@angular/router';
import { NotificationService } from '../service/notification.service';
import { User } from '../model/user';
import { Subscription } from 'rxjs';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { NotificationType } from '../enum/notification-type.enum';
import { HeaderType } from '../enum/header-type.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  public showLoading: boolean;
  private subscriptions: Subscription[] = [];

  constructor(private router: Router, private authenticationService: AuthenticationService, 
              private notificationService: NotificationService) { }

  ngOnInit(): void {
    if (this.authenticationService.isUserLoggedIn()) {  //if the user is already logged in, navigate them to the homepage
      this.router.navigateByUrl('/user/management');  
    } else {
      this.router.navigateByUrl('/login');
    }
  }
  //making a call to the backend to get the user login, if the response is successful we get the token from the headers, 
  //specify the key for the token 'Jwt-Token' and return the actual value, save it in the local storage with the user, 
  //then navigate the user to login page, and then stop the loading icon. otherwise we are gonna just log the error
  public onLogin(user: User): void {   //method called whenever user clicks on login
    this.showLoading = true; //a loading state should be displayed to the user.
    this.subscriptions.push( //adds the subscription to the subscriptions array 
      this.authenticationService.login(user).subscribe( //subscribes to the observable returned by the login method
        (response: HttpResponse<User>) => {
          const token = response.headers.get(HeaderType.JWT_TOKEN); //extracts the JWT token from the response headers
          this.authenticationService.saveToken(token);//save the token to the local storage
          this.authenticationService.addUserToLocalCache(response.body); //we need the WHOLE response including the body
          this.router.navigateByUrl('/user/management'); //user will be rerouted to the main page
          this.showLoading = false;
        },
        (errorResponse: HttpErrorResponse) => {
          this.sendErrorNotification(NotificationType.ERROR, errorResponse.error.message); //send notif to the user, then access the message inside the errorResponse(its a posibility that its null)
          this.showLoading = false;
        }
      )
    );
  }
  private sendErrorNotification(notificationType: NotificationType, message: string): void {
    if (message) { // here we are checking if the message its null.
      this.notificationService.notify(notificationType, message); //if exists, pass in the message
    } else {
      this.notificationService.notify(notificationType, 'An error occured. Please try again.'); //otherwise, send a custom message
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

}
