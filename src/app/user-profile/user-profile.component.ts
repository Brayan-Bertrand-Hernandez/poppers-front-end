import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ClientService } from '../client/client.service';

import { URL_BACKEND } from '../config/config';
import { User } from '../user/user';
import { UserService } from './user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  @Input() public client: User;
  public selectPhoto: File;
  public progress: number = 0;
  public url: string = URL_BACKEND;

  constructor(public modalService: UserService, public clientService: ClientService) { }

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

}
