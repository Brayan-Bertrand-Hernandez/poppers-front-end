import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DirectivaComponent } from './directiva/directiva.component';
import { ClientComponent } from './client/client.component';
import { FormComponent } from './client/form.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { DetailComponentClient } from './client/detail/detail.component';
import { LoginComponent } from './user/login.component';

import localeES from '@angular/common/locales/es-MX';
import { LandingComponent } from './landing/landing.component';
import { SignUpComponent } from './user/sign-up.component';
import { RoleGuard } from './user/guard/role.guard';
import { AuthGuard } from './user/guard/auth.guard';
import { TokenInterceptor } from './user/interceptor/token.interceptor';
import { AuthInterceptor } from './user/interceptor/auth.interceptor';
import { NotFoundedComponent } from './not-founded/not-founded.component';
import { ProductsComponent } from './products/products.component';
import { TicketDetailComponent } from './tickets/ticket-detail.component';

//Social login
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from 'angularx-social-login';
import { TicketsComponent } from './tickets/tickets.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { RecoverAccountComponent } from './user/recover-account/recover-account.component';
import { AdministrationComponent } from './administration/administration.component';
import { TicketClientComponent } from './ticket-client/ticket-client.component';
import { EnabledUserComponent } from './enabled-user/enabled-user.component';
import { DetailComponentTicket } from './ticket-client/detail/detail.component';
import { HeaderClientsComponent } from './header-clients/header-clients.component';
import { InvoiceClientComponent } from './invoice-client/invoice-client.component';
import { InvoiceDetailComponent } from './invoice-client/invoice-detail.component';
import { DetailInvoiceModalComponent } from './invoice-client/detail/detail-invoice-modal.component';
import { Google1f200dc62cb26e5bComponent } from './google1f200dc62cb26e5b/google1f200dc62cb26e5b.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

registerLocaleData(localeES, 'es-MX');

const routes: Routes = [
  {path: '', component: LandingComponent, pathMatch: 'full'},
  {path: 'directivas', component: DirectivaComponent},
  {path: 'clients', component: ClientComponent},
  {path: 'clients/page/:page', component: ClientComponent},
  {path: 'clients/form', component: FormComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},
  {path: 'clients/form/:id', component: FormComponent, canActivate: [AuthGuard ,RoleGuard], data: {role: 'ROLE_ADMIN'}},
  {path: 'administration', component: AdministrationComponent},
  {path: 'administration/page/:page', component: AdministrationComponent, canActivate: [AuthGuard ,RoleGuard], data: {role: 'ROLE_ADMIN'}},
  {path: 'tickets/:id', component: TicketDetailComponent},
  {path: 'tickets/form/:userId', component: TicketsComponent},
  {path: 'ticketClient/:id', component: TicketClientComponent},
  {path: 'ticketClient/page/:id:page', component: TicketClientComponent},
  {path: 'home', component: LandingComponent}, 
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignUpComponent},
  {path: 'recover', component: RecoverAccountComponent},
  {path: 'clients/enabled/:email', component: EnabledUserComponent},
  {path: 'products', component: ProductsComponent,canActivate: [AuthGuard ,RoleGuard], data: {role: 'ROLE_CLIENT'}},
  {path: 'invoice-detail/:id', component: InvoiceDetailComponent},
  {path: 'invoice', component: InvoiceClientComponent, canActivate: [AuthGuard ,RoleGuard], data: {role: 'ROLE_CLIENT'}},
  {path: 'google2952f6f1489b9559.html', component: Google1f200dc62cb26e5bComponent},
  {path: 'google2952f6f1489b9559', component: Google1f200dc62cb26e5bComponent},
  {path: '**', component: NotFoundedComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DirectivaComponent,
    ClientComponent,
    FormComponent,
    PaginatorComponent,
    DetailComponentClient,
    LoginComponent,
    LandingComponent,
    SignUpComponent,
    NotFoundedComponent,
    ProductsComponent,
    TicketDetailComponent,
    TicketsComponent,
    RecoverAccountComponent,
    AdministrationComponent,
    TicketClientComponent,
    EnabledUserComponent,
    DetailComponentTicket,
    HeaderClientsComponent,
    InvoiceClientComponent,
    InvoiceDetailComponent,
    DetailInvoiceModalComponent,
    Google1f200dc62cb26e5bComponent,
    UserProfileComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    SocialLoginModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule
  ],
  providers: [
    {provide: LOCALE_ID, useValue: 'es-MX'}, 
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '169244044231-l8a6puh5fmt406tek90gl3u4eta57ej2.apps.googleusercontent.com'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('805583546944858')
          }
        ]
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
