import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';
import { NotificationService } from '../service/notification.service';
import { NotificationType } from '../enum/notification-type.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  constructor(private authenticationService: AuthenticationService, private router: Router,
              private notificationService: NotificationService) {} //send user to certain route. AuthenticationService checks if a user is logged in, Router provides navigation and URL manipulation capabilities.
  
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.isUserLoggedIn();
  }
  
  private isUserLoggedIn(): boolean {
    if(this.authenticationService.isUserLoggedIn()) {
      return true;
    }
    this.router.navigate(['/login']);
    this.notificationService.notify(NotificationType.ERROR, 'You need to login to access this page.') //send a information to the user of WHY he got redirected
    return false;
  }
}
