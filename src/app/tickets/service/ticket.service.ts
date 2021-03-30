import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tick } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { Product } from '../model/product';
import { Ticket } from '../model/ticket';

import { URL_BACKEND } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private urlEndPoint: string = URL_BACKEND + '/api/tickets';

  constructor(public http: HttpClient) { }

  public getTicket(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${ this.urlEndPoint }/${ id }`);
  }

  public delete(id: number): Observable<void> {
    return this.http.delete<void>(`${ this.urlEndPoint }/${ id }`);
  }

  public filterProducts(term: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${ this.urlEndPoint }/product-filter/${ term }`);
  }

  public create(ticket: Ticket): Observable<Ticket> {
    return this.http.post<Ticket>(this.urlEndPoint, ticket);
  }

  public downloadTicket(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${ this.urlEndPoint }/pdf/${ id }`);
  }

  public downloadTickets(id: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${ this.urlEndPoint }/pdf-per-id/${ id }`);
  }

  public downloadAllTickets(): Observable<Ticket> {
    return this.http.get<Ticket>(this.urlEndPoint + '/pdf');
  }

  public update(ticket: Ticket): Observable<Ticket> {
    return this.http.put<Ticket>(`${ this.urlEndPoint }/${ ticket.id }`, ticket);
  }
}
