import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../model/user';
import { Token } from '@angular/compiler';
import { CustomHttpResponse } from '../model/custom-http-response';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private host = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getUsers(): Observable<User[]> { //either get an array of users or an error response
    return this.http.get<User[]>(`${this.host}/user/list`); //get a list of users back
  }

  public addUser(formData: FormData): Observable<User> { //add an user through a form
    return this.http.post<User>(`${this.host}/user/add`, formData); 
  }

  public updateUser(formData: FormData): Observable<User> { 
    return this.http.post<User>(`${this.host}/user/update`, formData); 
  }

  public resetPassword(email: String): Observable<CustomHttpResponse | HttpErrorResponse> { 
    return this.http.get<CustomHttpResponse>(`${this.host}/user/resetPassword/${email}`); 
  }

  public updateProfileImage(formData: FormData): Observable<HttpEvent<User>> { 
    return this.http.post<User>(`${this.host}/user/updateProfileImage`, formData, 
    {reportProgress: true,
    observe: 'events'}); 
  }

  public deleteUser(username: string): Observable<CustomHttpResponse> {
    return this.http.delete<CustomHttpResponse>(`${this.host}/user/delete/${username}`);
  }

  public addUsersToLocalCache(users: User[]): void { 
    localStorage.setItem('users', JSON.stringify(users));
  }

  public getUsersFromLocalCache(): User[] { 
    if (localStorage.getItem('users')) {
      return JSON.parse(localStorage.getItem('users'));
    }
    return null;
  }

  public createUserFormData(loggedInUsername: string, user: User, profileImage: File): FormData { 
    const formData = new FormData();
    formData.append('currentUsername', loggedInUsername);
    formData.append('firstName', user.firstName);
    formData.append('lastName', user.lastName);
    formData.append('username', user.username);
    formData.append('email', user.email);
    formData.append('role', user.role);
    formData.append('profileImage', profileImage);
    formData.append('isActive', JSON.stringify(user.active));
    formData.append('isNonLocked', JSON.stringify(user.notLocked));
    return formData;
  }
}
