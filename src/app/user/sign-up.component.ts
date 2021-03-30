import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import Swal from 'sweetalert2';
import { ClientService } from '../client/client.service';
import { Country } from '../client/country';
import { AuthService } from './auth.service';
import { User } from './user';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  public user: User = new User();
  public logged: any;
  public countries: Country[];
  public socialUser: SocialUser;
  public loggedUser: SocialUser;
  public isLogged: boolean;

  constructor(public clientService: ClientService, public router: Router, public authService: AuthService, public authServiceSocial: SocialAuthService) { this.user = new User(); }

  ngOnInit(): void {
    this.loadData();
    this.socialAuth();
    this.normalAuth();
  }

  public socialAuth(): void {
    this.authServiceSocial.authState.subscribe(
      data => {
        this.loggedUser = data;
        this.isLogged = (this.loggedUser != null); 
      });
  }

  public normalAuth(): void {
    if(this.authService.isAuthenticated()) {
      Swal.fire('Login', `Hola ${ this.authService.user.username } ya estás autenticado!`, 'info');

      this.router.navigate(['/clients']);
    }
  }

  public loadData(): void {
    this.clientService.getCountries().subscribe(country => this.countries = country);
  }

  public create(): void {
    this.clientService.createSign(this.user).subscribe(
      user => { 
        this.router.navigate(['/login']);
        Swal.fire('Nuevo usuario', `Usuario ${ user.name } creado con éxito!`, 'success');
      },
      e => {
        if(e.status == 500) {
          this.router.navigate(['/login']);
          Swal.fire('Error de sign up', `Usuario ${ this.user.name } ya ha sido registrado!`, 'warning');
        }
      });
  }

  public createSocial(): void {
    this.clientService.createSocial(this.user).subscribe(
      user => {
        this.router.navigate(['/login']);
        Swal.fire('Nuevo usuario', `Usuario ${ user.name } creado con éxito!`, 'success');
      }, 
      e => {
        if(e.status == 500) {
          this.router.navigate(['/login']);
          Swal.fire('Error de sign up', `Usuario ${ this.user.name } ya ha sido registrado!`, 'warning');
        }
      }
    );
  }

  public signInWithGoogle(): void {
    this.authServiceSocial.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      data => {
        this.socialUser = data;
        this.isLogged = true;

        this.user.name = this.socialUser.name;
        this.user.username = this.socialUser.firstName + this.socialUser.id;
        this.user.country = this.countries[15];
        this.user.email = this.socialUser.email;
        this.user.address = 'Unknowed.';
        this.user.cellphone = 'Unknowned.';
        this.user.token = this.socialUser.authToken.substring(0,200);
        this.user.password = 'Contraseña encriptada';

        this.createSocial();
      });
  }

  public signInWithFB(): void {
    this.authServiceSocial.signIn(FacebookLoginProvider.PROVIDER_ID).then(
     data => {
      this.socialUser = data;
      this.isLogged = true;

      this.user.name = this.socialUser.name;
      this.user.username = this.socialUser.firstName + this.socialUser.id;
      this.user.country = this.countries[15];
      this.user.email = this.socialUser.email;
      this.user.address = 'Unknowed.';
      this.user.token = this.socialUser.authToken.substring(0,200);
      this.user.cellphone = 'Unknowned.';
      this.user.password = 'Contraseña encriptada';

      this.createSocial();
     });
  }

}
