import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { User } from './user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public user: User;
  public socialUser: SocialUser;
  public loggedUser: SocialUser;
  public isLogged: boolean;

  constructor(public authService: AuthService, public router: Router, public authServiceSocial: SocialAuthService) { this.user = new User(); }

  ngOnInit(): void {
    this.socialAuth();
    this.normalAuth();
  }

  public socialAuth(): void {
    if(this.isLogged){
      this.authServiceSocial.authState.subscribe(
        data => {
          this.loggedUser = data;
          this.isLogged = (this.loggedUser != null); 
        });
    }
  }

  public normalAuth(): void {
    if(this.authService.isAuthenticated()) {
      Swal.fire('Login', `Hola ${ this.authService.user.username } ya estás autenticado!`, 'info');

      this.router.navigate(['/clients']);
    }
  }

  public login(): void {
    if(!this.isLogged) {
      if(this.user.username == null || this.user.password == null) {
        Swal.fire('Error sign in', 'Username o password vacíos!', 'error');
  
        return;
      }
    }

    this.authService.login(this.user).subscribe(
      response => { 
        this.authService.saveUser(response.access_token);
        this.authService.saveToken(response.access_token);
        
        let user = this.authService.user;

        if(this.user.password === 'Contraseña encriptada' || this.authService.hasRole('ROLE_CLIENT') || this.authService.hasRole('ROLE_SOCIAL')) {
          this.router.navigate(['/products']);
        } else {
          this.router.navigate(['/clients']);
        }

        Swal.fire('Login', `Hola ${ user.name }, has iniciado sesión con éxito!`, 'success');
      }, 
      err => {
        if(this.isLogged) {
          Swal.fire('Error sign in', 'Registrate primero', 'error');
        } else {
          if(err.status == 400) {
            Swal.fire('Error sign in', 'Username o password incorrectos!', 'error');
  
            this.router.navigate(['/login']);
  
            this.authService.logout();
          }
  
          if(err.status == 401) {
            Swal.fire('Error sign in', 'Username o password incorrectos!', 'error');
          }
        }
    });
  }

  public signInWithGoogle(): void {
    this.authServiceSocial.signIn(GoogleLoginProvider.PROVIDER_ID).then(
      data => {
        this.socialUser = data;
        this.isLogged = true;

        this.user.username = this.socialUser.firstName + this.socialUser.id;
        this.user.password = 'Contraseña encriptada';

        this.login();
      });
  }

  public signInWithFB(): void {
    this.authServiceSocial.signIn(FacebookLoginProvider.PROVIDER_ID).then(
     data => {
      this.socialUser = data;
      this.isLogged = true;

      this.user.username = this.socialUser.firstName + this.socialUser.id;
      this.user.password = 'Contraseña encriptada';

      this.login();
     });
  }
}
