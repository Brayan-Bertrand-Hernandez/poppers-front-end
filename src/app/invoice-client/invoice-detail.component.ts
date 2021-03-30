import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Ticket } from '../tickets/model/ticket';
import { TicketService } from '../tickets/service/ticket.service';

import { URL_BACKEND } from '../config/config';

@Component({
  selector: 'app-invoice-detail',
  templateUrl: './invoice-detail.component.html',
  styleUrls: ['./invoice-detail.component.css']
})
export class InvoiceDetailComponent implements OnInit {
  public ticket: Ticket;
  public url: string = URL_BACKEND;

  constructor(public ticketService: TicketService, public activedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activedRoute.paramMap.subscribe(params => {
      let id = parseInt(params.get('id'));

      this.ticketService.getTicket(id).subscribe(ticket => {
        this.ticket = ticket;

        console.log(ticket);
      });

      
    });
  }

}
