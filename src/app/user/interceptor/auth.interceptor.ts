import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http'; 
import { Observable,  throwError} from 'rxjs';
import { AuthService } from '../auth.service';
import { catchError } from 'rxjs/operators';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(public authService: AuthService, public router: Router) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError(e => {
                  if(e.status == 401) {
                    if(this.authService.isAuthenticated()) {
                      this.authService.logout();
                    }

                    this.router.navigate(['/login']);
                  }
              
                  if(e.status == 403) {
                    Swal.fire('Acceso denegado', `Hola ${ this.authService.user.username } no tienes acceso a este recuros!`, 'warning');
              
                    this.router.navigate(['/login']);

                    this.authService.logout();
                  }
              
                  return throwError(e);
            })
        );
    }
}
