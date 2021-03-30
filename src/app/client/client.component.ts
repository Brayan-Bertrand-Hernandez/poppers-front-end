import { Component, OnInit } from '@angular/core';
import { ClientService } from './client.service';
import swal from 'sweetalert2';
import { tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from './detail/modal.service';
import { AuthService } from '../user/auth.service';
import { User } from '../user/user';

import { URL_BACKEND } from '../config/config';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  public clients: User[] = [];
  public paginator: any;
  public selectedClient: User;
  public url: string = URL_BACKEND;

  constructor(public clientService: ClientService, public activatedRoute: ActivatedRoute, public modalService: ModalService, public authService: AuthService, public router: Router) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      let page: number = parseInt(params.get('page'));

      if(!page) {
        page = 0;
      }

      this.clientService.getClients(page).pipe(
        tap(response=> {
          response.content as User[];
        })
      ).subscribe(response => {
        this.clients = response.content as User[];
        this.paginator = response;
      })
    });

    this.modalService.notifyUpload.subscribe(client => {
      this.clients = this.clients.map(originaClient => {
        if(client.id == originaClient.id) {
          originaClient.photo = client.photo;
        }

        return originaClient;
      })
    });
  }

  public delete(client: User): void {
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });
    
    swalWithBootstrapButtons.fire({
      title: '¿Estás seguro?',
      text: `No serás capaz de recuperar al cliente ${ client.name }!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminalo!',
      cancelButtonText: 'No, cancelalo!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.clientService.delete(client.id).subscribe(
          response => {
            this.clients = this.clients.filter(cli => cli !== client);

            swalWithBootstrapButtons.fire(
              'Borrado!',
              `El cliente ${ client.name } ha sido eliminado.`,
              'success'
            );
          }
        );
      } else if (
        result.dismiss === swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'El cliente permenecerá un tiempo más con vida :)',
          'error'
        );
      }
    });
  }

  public openModal(client: User): void {
    this.selectedClient = client;
    this.modalService.openModal();
  }
}
