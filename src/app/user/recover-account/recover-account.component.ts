import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientService } from 'src/app/client/client.service';
import Swal from 'sweetalert2';
import { User } from '../user';

@Component({
  selector: 'app-recover-account',
  templateUrl: './recover-account.component.html',
  styleUrls: ['./recover-account.component.css']
})
export class RecoverAccountComponent implements OnInit {
  public user: User;

  constructor(public clientService: ClientService, public router: Router) { this.user = new User(); }

  ngOnInit(): void {
  }

  public recover(): void {
    this.clientService.recoverAccount(this.user).subscribe(
      user => { 
        this.router.navigate(['/login']);
        Swal.fire('Usuario recuperado', `Usuario ${ this.user.name } ve a tu email y observa tus datos de recuperación!`, 'success');
      }, 
      err => {
        if(err.status == 404) {
          this.router.navigate(['/signup']);
          Swal.fire('Usuario no registrado', `Usuario con correo ${ this.user.email } no registrado!`, 'warning');
        }
      });
  }

}
