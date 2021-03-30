import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ClientService } from '../client/client.service';
import { ModalService } from '../client/detail/modal.service';
import { AuthService } from '../user/auth.service';
import { User } from '../user/user';

import { URL_BACKEND } from '../config/config';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.css']
})
export class AdministrationComponent implements OnInit {
  public clients: User[] = [];
  public paginator: any;
  public selectedClient: User;
  public url: string = URL_BACKEND;

  constructor(private clientService: ClientService, private activatedRoute: ActivatedRoute, private modalService: ModalService, public authService: AuthService) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      let page: number = parseInt(params.get('page'));

      if(!page) {
        page = 0;
      }

      this.clientService.getAdministration(page).pipe(
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
    const swalWithBootstrapButtons = Swal.mixin({
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
        result.dismiss === Swal.DismissReason.cancel
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
