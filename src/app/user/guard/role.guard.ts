import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { stringify } from 'querystring';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(public authService: AuthService, public router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(!this.authService.isAuthenticated()) {
        this.router.navigate(['/login']);

        return false;
      }

      let role = route.data['role'] as string;

      if(this.authService.hasRole(role)) {
        return true;
      }
      
      Swal.fire('Acceso denegado', `Hola ${ this.authService.user.username } no tienes acceso a este recurso!`, 'warning');
      this.router.navigate(['/clients']);

    return false;
  }
  
}
