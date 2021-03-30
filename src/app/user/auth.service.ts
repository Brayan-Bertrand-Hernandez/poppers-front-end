import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user';

import { URL_BACKEND } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user: User;
  private _token: string;

  constructor(public http: HttpClient) { }

  public get user(): User {
    if(this._user != null) {
      return this._user; 
    } else if(this._user = null && sessionStorage.getItem('user') != null) {
      this._user = JSON.parse(sessionStorage.getItem('user')) as User;

      return this._user;
    }
    
    return new User();
  }

  public get token(): string {
    if(this._token != null) {
      return this._token; 
    } else if(this._token = null && sessionStorage.getItem('token') != null) {
      this._token = sessionStorage.getItem('token');

      return this._token;
    }
    
    return null;
  }

  public login(user: User): Observable<any> {
    console.log(user);

    const urlEndPoint = URL_BACKEND + '/oauth/token';
    const credentials = btoa('angularapp' + ':' + '12345');
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded', 
      'Authorization' : 'Basic ' + credentials
    });

    let params = new URLSearchParams();

    params.set('grant_type', 'password');
    params.set('username', user.username);
    params.set('password', user.password);
 
    return this.http.post<any>(urlEndPoint, params.toString(), { headers: httpHeaders });
  }

  public logout(): void {
    this._user = null;
    this._token = null;

    sessionStorage.clear();
  }

  public saveUser(accessToken: string): void {
    let payload = this.getTokenData(accessToken);
    this._user = new User();

    this._user.name = payload.Nombre;
    this._user.email = payload.Email;
    this._user.username = payload.user_name;
    this._user.roles = payload.authorities;

    sessionStorage.setItem('user', JSON.stringify(this._user));
  }

  public saveToken(accessToken: string): void {
    this._token = accessToken;

    sessionStorage.setItem('token', this._token);
  }

  public getTokenData(accessToken: string): any {
    if(accessToken != null) {
      return JSON.parse(atob(accessToken.split(".")[1]));
    } 

    return null;
  }

  public isAuthenticated(): boolean {
    let payload = this.getTokenData(this._token);

    if(payload != null && payload.user_name && payload.user_name.length > 0) {
      return true;
    }

    return false;
  }

  public hasRole(role: string): boolean {
    if(this.user.roles.includes(role)) {
      return true;
    }

    return false;
  }

}
