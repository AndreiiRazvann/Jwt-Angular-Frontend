import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({providedIn: 'root'})

export class AuthenticationService {
  public host = environment.apiUrl;
  private token: string;
  private loggedInUsername: string;
  private jwtHelperService = new JwtHelperService();

  constructor(private http: HttpClient) { }

  public login(user: User): Observable<HttpResponse<User>> { //im expecting an object of user type, its an observable and its gonna either return a response, or an error
    return this.http.post<User>(`${this.host}/user/login`, user, {observe: 'response'}); //were passing the host(localhost:8081) and /user/login, and the request body(user). then give me the whole response, including headers,body,TOKEN
  }

  public register(user: User): Observable<User> {
    return this.http.post<User>(`${this.host}/user/register`, user);
  }

  public logOut(): void {
    this.token = null;
    this.loggedInUsername = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('users');
  }

  public saveToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token); //in the local storage, set the token and refference it by the 'token' id(key value pair)
  }

  public addUserToLocalCache(user: User): void {
    localStorage.setItem('user', JSON.stringify(user)); //add user that logged in into the local storage by the name. we have the user, and the value of the user only accepts strings('user', JSON.stringify(user)) 
  }

  public getUserFromLocalCache(): User {
    return JSON.parse(localStorage.getItem('user')); //get an object that is string format and transform it into actual object(JSON.parse)
  }

  public loadToken(): void {
    this.token = localStorage.getItem('token') //set the token from this class to the actual token from the local storage
  }

  public getToken(): string {
    return this.token //return the token saved in the local storage
  }

  //check if the user is logged or not
  public isUserLoggedIn(): boolean {
    this.loadToken();
    if (this.token != null && this.token !== '') {
      if (this.jwtHelperService.decodeToken(this.token).sub != null || '') { //decode the token, get the subject(username),if its not empty or null
        if (!this.jwtHelperService.isTokenExpired(this.token)) {
          this.loggedInUsername = this.jwtHelperService.decodeToken(this.token).sub;
          return true;
        }
      } 
    } else {
      this.logOut();
      return false;
    }
  }
}
