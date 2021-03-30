import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ClientService } from 'src/app/client/client.service';
import { Ticket } from 'src/app/tickets/model/ticket';
import { AuthService } from 'src/app/user/auth.service';
import Swal from 'sweetalert2';
import { ModalService } from './modal.service';

import { URL_BACKEND } from '../../config/config';

@Component({
  selector: 'ticket-detail-modal',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponentTicket implements OnInit {
  @Input() public ticket: Ticket;
  public selectPhoto: File;
  public progress: number = 0;
  public url: string = URL_BACKEND;

  constructor(public modalService: ModalService, public clientService: ClientService, public authService: AuthService) { }

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
      let id: string = this.ticket.id.toString();
      this.clientService.uploadTicket(this.selectPhoto, id).subscribe(
        event => {
          if(event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round((event.loaded/event.total) * 100);
          } else if(event.type === HttpEventType.Response) {
            let response: any = event.body;
            this.ticket = response.Cliente as Ticket;

            this.modalService.notifyUpload.emit(this.ticket);

            Swal.fire('La foto se ha subido completamente, vuelvea  esta página en unos segundos para ver la imágen!', response.Mensaje, 'success');
          }
        });
    }
  }

  public closeModal(): void {
    this.modalService.closeModal();
    this.selectPhoto = null;
    this.progress = 0;
  }

}
