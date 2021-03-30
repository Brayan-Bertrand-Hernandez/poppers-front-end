import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { Country } from './country';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../user/user';
import { Role } from '../user/role';

import { URL_BACKEND } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class ClientService { 
  private urlEndPoint: string = URL_BACKEND + '/api/clients';  

  constructor(public http: HttpClient, public router: Router) { }

  public getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(this.urlEndPoint + '/countries');
  }

  public getRoles(): Observable<Role[]> { 
    return this.http.get<Role[]>(this.urlEndPoint + '/roles');
  }

  public recoverAccount(user: User) : Observable<User> {
    return this.http.post(this.urlEndPoint + '/recoverAccount', user).pipe(
      map((response: any) => response.Cliente as User),
      catchError(
        e => {
          if(e.status == 401) {
            return throwError(e);
          }

          if(e.error.Error) {
            console.error(e.error.Error);
          }

          return throwError(e);
        })
    );
  }

  public activateAccount(email: string) : Observable<User> {
    return this.http.get(this.urlEndPoint + '/enabled/' + email).pipe(
      map((response: any) => response.Cliente as User),
      catchError(
        e => {
          if(e.status == 401) {
            return throwError(e);
          }

          if(e.error.Error) {
            console.error(e.error.Error);
          }

          return throwError(e);
        })
    );
  }

  public create(user: User) : Observable<User> {
    return this.http.post(this.urlEndPoint, user).pipe(
      map((response: any) => response.Cliente as User),
      catchError(
        e => {
          if(e.status == 401) {
            return throwError(e);
          }

          if(e.error.Error) {
            console.error(e.error.Error);
          }

          return throwError(e);
        })
    );
  }

  public createSign(user: User) : Observable<User> {
    return this.http.post(this.urlEndPoint + '/sign-up', user).pipe(
      map((response: any) => response.Cliente as User),
      catchError(
        e => {
          if(e.status == 401) {
            return throwError(e);
          }

          if(e.error.Error) {
            console.error(e.error.Error);
          }

          return throwError(e);
        })
    );
  }

  public createSocial(user: User) :Observable<User> {
    return this.http.post(this.urlEndPoint + '/social', user).pipe(
      map((response: any) => response.Social as User),
      catchError(
        e => {
          if(e.status == 401) {
            return throwError(e);
          }

          if(e.error.Error) {
            console.error(e.error.Error);
          }

          return throwError(e);
        })
    );
  } 

  public update(user: User): Observable<User> {
    return this.http.put(`${ this.urlEndPoint }/${ user.id }`, user).pipe(
      map((response: any) => response.Cliente as User),
      catchError(
        e => {
          if(e.status == 401) {
            return throwError(e);
          }

          if(e.error.Error) {
            console.error(e.error.Error);
          }

          return throwError(e);
        })
    );
  }

  public delete(id: number): Observable<User> {
    return this.http.delete<User>(`${ this.urlEndPoint }/${ id }`).pipe(
      catchError(
        e => {
          if(e.error.Error) {
            console.error(e.error.Error);
          }

          return throwError(e);
        })
    );
  }

  public getClients(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint + '/role/enabled/page/' + page).pipe(
      tap((response: any) => {
        response.content as User[];
      }),
      map((response: any) => {
        response.content as User[];

        return response;
      }),
      tap((response: any) => {
        response.content as User[];
      })
    );
  }

  public getAdministration(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint + '/administration/page/' + page).pipe(
      tap((response: any) => {
        response.content as User[];
      }),
      map((response: any) => {
        response.content as User[];

        return response;
      }),
      tap((response: any) => {
        response.content as User[];
      })
    );
  }

  public getClient(id: number): Observable<User> {
    return this.http.get<User>(`${ this.urlEndPoint }/${ id }`).pipe(
      catchError(
        e => {
          if(e.status != 401 && e.error.Error) {
            this.router.navigate(['/login']);

            console.error(e.error.Error);
          } 

          return throwError(e);
        })
    );
  }

  public getClientEmail(email: string): Observable<User> {
    return this.http.get<User>(`${ this.urlEndPoint }/email/${ email }`).pipe(
      catchError(
        e => {
          if(e.status != 401 && e.error.Error) {
            this.router.navigate(['/login']);

            console.error(e.error.Error);
          } 

          return throwError(e);
        })
    );
  }

  public uploadPhoto(file: File, id: string): Observable<HttpEvent<{}>> {
    let formData = new FormData();

    formData.append("file", file);
    formData.append("id", id);

  
    const req = new HttpRequest('POST', `${ this.urlEndPoint }/upload`, formData, { reportProgress: true });
    
    return this.http.request(req);
  }

  public uploadTicket(file: File, id: string): Observable<HttpEvent<{}>> {
    let formData = new FormData();

    formData.append("file", file);
    formData.append("id", id);

  
    const req = new HttpRequest('POST', `${ this.urlEndPoint }/upload/ticket`, formData, { reportProgress: true });
    
    return this.http.request(req);
  }
}
