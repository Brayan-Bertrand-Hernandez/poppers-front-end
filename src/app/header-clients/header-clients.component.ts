import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService, SocialUser } from 'angularx-social-login';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ClientService } from '../client/client.service';
import { UserService } from '../user-profile/user.service';
import { AuthService } from '../user/auth.service';
import { User } from '../user/user';

import { URL_BACKEND } from '../config/config';

@Component({
  selector: 'app-header-clients',
  templateUrl: './header-clients.component.html',
  styleUrls: ['./header-clients.component.css']
})
export class HeaderClientsComponent {
  public selectedClient: User;
  public loggedUser: SocialUser;
  public isLogged: boolean = false;
  public id: number = 0;
  public client: User = new User();

  public url: string = URL_BACKEND;

  public daysArray = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado'];
  public date = new Date();

  public day: string;
  public ampm: string;
  public hour: any;
  public minute: string;
  public second: string;

  constructor(public authServiceSocial: SocialAuthService, public router: Router, public authService: AuthService, public clientService: ClientService, public modalService: UserService) { }

  ngOnInit(): void {
    setInterval(() => {
      const date = new Date();
      this.updateDate(date);
    }, 1000);

    this.day = this.daysArray[this.date.getDay()];

    this.client = this.authService.user;

    if(this.authService.user.token !== null) {
      this.authServiceSocial.authState.subscribe(
        data => {
          this.loggedUser = data;
          this.isLogged = (this.loggedUser != null);
        }
      );
    }

    this.clientService.getClientEmail(this.client.email).pipe(
      tap(response=> {
        response as User;
      })
    ).subscribe(client => {
      this.client = client;
      this.id = client.id as number;

      console.log(this.id);
    });


    this.modalService.notifyUpload.subscribe(client => {
      if(client.id == this.client.id) {
        this.client.photo = client.photo;
      }

      return this.client;
    });
  }

  public updateDate(date: Date) {
    const hours = date.getHours();

    this.ampm = hours >= 12 ? 'PM' : 'AM';

    this.hour = hours % 12; 
    this.hour = this.hour ? this.hour : 12;
    this.hour = this.hour < 10 ? '0' + this.hour : this.hour;

    const minutes = date.getMinutes();

    this.minute = minutes < 10 ? '0' + minutes : minutes.toString();

    const seconds = date.getSeconds();
    
    this.second = seconds < 10 ? '0' + seconds : seconds.toString();
  }

  public logOut(): void {
    this.authServiceSocial.signOut().then(
      data => {
        Swal.fire('Logout social popper!', `Hola ${ this.authService.user.name } has cerrado sesión con éxito!`, 'success');
        this.authService.logout();

        this.router.navigate(['/home']);
      });
  }

  public logout(): void {
    console.log(this.authService.user);
    if(this.isLogged) {
      this.logOut();
    } else {
      Swal.fire('Logout popper!', `Hola ${ this.authService.user.name } has cerrado sesión con éxito!`, 'success');
      this.authService.logout();

      this.router.navigate(['/home']);
    }
  }

  public openModal(client: User): void {
    console.log(client.id);
    this.selectedClient = client;
    this.modalService.openModal();
  }
}
