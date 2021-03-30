import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../user/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent {
    constructor(public authService: AuthService, public router: Router) {}

    public logout(): void {
        Swal.fire('Logout', `Hola ${ this.authService.user.username } has cerrado sesión con éxito!`, 'success');

        this.authService.logout();

        this.router.navigate(['/home']);
    }
}