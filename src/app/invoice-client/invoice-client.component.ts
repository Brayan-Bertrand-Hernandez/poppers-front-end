import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ClientService } from '../client/client.service';
import { Ticket } from '../tickets/model/ticket';
import { TicketService } from '../tickets/service/ticket.service';
import { AuthService } from '../user/auth.service';
import { User } from '../user/user';
import { ModalServiceService } from './detail/modal-service.service';

import { URL_BACKEND } from '../config/config';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoice-client',
  templateUrl: './invoice-client.component.html',
  styleUrls: ['./invoice-client.component.css']
})
export class InvoiceClientComponent implements OnInit {
  public user: User = new User();
  public client: User;
  public ticket: Ticket = new Ticket();
  public tickets: Ticket[] = [];
  public selectedTicket: Ticket;
  public id: number;
  public url: string = URL_BACKEND;

  constructor(public clientService: ClientService, public tikcetService: TicketService, public modalService: ModalServiceService, public authService: AuthService, public router: Router) { }

  ngOnInit(): void {
    this.user = this.authService.user;

    this.clientService.getClientEmail(this.user.email).pipe(
      tap(response=> {
        response.tickets as Ticket[];
      })
    ).subscribe(client => {
      this.client = client;
      this.id = client.id as number;

      console.log(this.id);
    });

    console.log(this.id);

    this.modalService.notifyUpload.subscribe(ticket => {
      this.client.tickets = this.tickets.map(originaTicket => {
        if(ticket.id == originaTicket.id) {
          originaTicket.pdf = ticket.pdf;          
        }

        return originaTicket;
      })

      this.router.navigate(['/products']);
    });
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

  public openModal(ticket: Ticket): void {
    this.selectedTicket = ticket;
    this.modalService.openModal();
  }
}
