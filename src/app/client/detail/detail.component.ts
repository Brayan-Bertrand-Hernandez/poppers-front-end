import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Ticket } from 'src/app/tickets/model/ticket';
import { TicketService } from 'src/app/tickets/service/ticket.service';
import { AuthService } from 'src/app/user/auth.service';
import { User } from 'src/app/user/user';
import Swal from 'sweetalert2';
import { ClientService } from '../client.service';
import { ModalService } from './modal.service';

import { URL_BACKEND } from '../../config/config';

@Component({
  selector: 'client-detail-modal',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponentClient implements OnInit {
  @Input() public client: User;
  public selectPhoto: File;
  public ticket: Ticket;
  public progress: number = 0;
  public url: string = URL_BACKEND;

  constructor(public clientService: ClientService, public modalService: ModalService, public authService: AuthService, public tikcetService: TicketService) { }

  ngOnInit(): void {
    
  }

  public selectedPhoto(event): void {
    this.selectPhoto = event.target.files[0];
    this.progress = 0;

    if(this.selectPhoto.type.indexOf('image') < 0) {
      Swal.fire('Error al seleccionar: ', 'Debe seleccionar una imágen.', 'error');
      this.selectPhoto = null;
    }
  }

  public uploadPhoto(): void {
    if(!this.selectPhoto) {
      Swal.fire('Error al subir: ', 'Debe seleccionar una imágen.', 'error');
    } else {
      let id: string =  this.client.id.toString();
      this.clientService.uploadPhoto(this.selectPhoto, id).subscribe(
        event => {
          if(event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round((event.loaded/event.total) * 100);
          } else if(event.type === HttpEventType.Response) {
            let response: any = event.body;
            this.client = response.Cliente as User;

            this.modalService.notifyUpload.emit(this.client);

            Swal.fire('La foto se ha subido completamente!', response.Mensaje, 'success');
          }
        });
    }
  }

  public closeModal(): void {
    this.modalService.closeModal();
    this.selectPhoto = null;
    this.progress = 0;
  }

  public deleteTicket(ticket: Ticket): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });
    
    swalWithBootstrapButtons.fire({
      title: '¿Estás seguro?',
      text: `No serás capaz de recuperar esta factura ${ ticket.description }!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminala!',
      cancelButtonText: 'No, cancelalo!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.tikcetService.delete(ticket.id).subscribe(
          response => {
            this.client.tickets = this.client.tickets.filter(t => t !== ticket);

            swalWithBootstrapButtons.fire(
              'Borrada!',
              `La factura ${ ticket.description } ha sido eliminada.`,
              'success'
            );
          }
        );
      } else if (
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'La factura permenecerá un tiempo más con vida :)',
          'error'
        );
      }
    });
  }

}
