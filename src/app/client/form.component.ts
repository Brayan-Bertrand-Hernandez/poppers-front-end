import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ClientService } from './client.service';
import swal from 'sweetalert2';
import { Country } from './country';
import { User } from '../user/user';
import { Role } from '../user/role';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  public client: User = new User();
  public errs: string[];
  public countries: Country[];
  public roles: Role[];

  constructor(public clientService: ClientService, public router: Router, public activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadClient();
  }

  public loadClient(): void {
    this.activatedRoute.params.subscribe(
      params => {
        let id = params['id'];

        if(id) {
          this.clientService.getClient(id).subscribe((client) => this.client = client);
        }
      }
    );

    this.clientService.getCountries().subscribe(countries => this.countries = countries);
    this.clientService.getRoles().subscribe(roles => this.roles = roles);
  }

  public create(): void {
    this.clientService.create(this.client).subscribe(
      client => { 
        this.router.navigate(['/clients']);
        swal.fire('Nuevo cliente', `Cliente ${ client.name } creado con éxito!`, 'success');
      });
  }

  public update(): void {
    this.client.tickets = null;

    if(this.client.token) {
      swal.fire('Cliente imposible de modificar', `Cliente ${ this.client.name } se ha registrado con una cuenta social!`, 'error');
    } else {
      this.clientService.update(this.client).subscribe(
        client => {
          this.router.navigate(['/clients']);
          swal.fire('Cliente actualizado', `Cliente ${ client.name } actualizado con éxito!`, 'success');
        });
    }
  }

  public compareCountry(previousCountry: Country, nextCountry: Country): boolean {
    if(previousCountry === undefined && nextCountry === undefined) {
      return true;
    }

    return previousCountry == null || nextCountry == null ? false : previousCountry.id == nextCountry.id;
  }

  public compareRole(previousRole: Role, nextRole: Role): boolean {
    if(previousRole === undefined && nextRole === undefined) {
      return true;
    }

    return previousRole == null || nextRole == null ? false : previousRole.id == nextRole.id;
  }
}