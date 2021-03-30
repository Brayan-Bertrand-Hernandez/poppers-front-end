import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ClientService } from '../client/client.service';
import { Ticket } from '../tickets/model/ticket';
import { TicketService } from '../tickets/service/ticket.service';
import { User } from '../user/user';
import { ModalService } from './detail/modal.service';

import { URL_BACKEND } from '../config/config';

@Component({
  selector: 'app-ticket-client',
  templateUrl: './ticket-client.component.html',
  styleUrls: ['./ticket-client.component.css']
})
export class TicketClientComponent implements OnInit {
  public client: User;
  public ticket: Ticket = new Ticket();
  public tickets: Ticket[] = [];
  public selectedTicket: Ticket;
  public url: string = URL_BACKEND;

  constructor(public activatedRoute: ActivatedRoute, public clientService: ClientService, public tikcetService: TicketService, public modalService: ModalService, public router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let id = parseInt(params.get('id'));

      this.clientService.getClient(id).pipe(
        tap(response=> {
          response.tickets as Ticket[];
        })
      ).subscribe(client => {
        this.client = client;
      });
    });

    this.modalService.notifyUpload.subscribe(ticket => {
      this.client.tickets = this.tickets.map(originaTicket => {
        if(ticket.id == originaTicket.id) {
          originaTicket.pdf = ticket.pdf;
        }

        return originaTicket;
      })
      
      this.router.navigate(['/clients']);
    });
  }

  public check(ticket: Ticket): void {
    if(ticket.checked) {
      Swal.fire('Ticket', `Ticket ${ ticket.description } ya ha sido aceptado!`, 'info');
    } else {
      if(ticket.pdf) {
        this.tikcetService.update(ticket).subscribe(
          ticket => {
            Swal.fire('Ticket aceptado', `Ticket ${ ticket.description } actualizado con éxito, vuelve a esta página en unos segundos para ver reflejado el cambio!`, 'success');
          }
        );
      } else {
        Swal.fire('Ticket retenido', `Ticket ${ ticket.description } no tiene archivo que verificar!`, 'error');
      }
    }
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
