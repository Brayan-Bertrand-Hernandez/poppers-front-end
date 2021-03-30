import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalServiceService {
  public modal: boolean = false;
  private _notifyUpload = new EventEmitter<any>();

  constructor() { }

  public openModal(): void {
    this.modal = true;
  }

  public closeModal(): void {  
    this.modal = false;
  }

  public get notifyUpload(): EventEmitter<any>{
    return this._notifyUpload;
  }
}
