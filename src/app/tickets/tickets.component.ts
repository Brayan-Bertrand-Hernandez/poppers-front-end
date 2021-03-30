import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { ClientService } from '../client/client.service';
import { Ticket } from './model/ticket';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { TicketService } from './service/ticket.service';
import { Product } from './model/product';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { TicketItem } from './model/ticket-item';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {
  public autocompleteControl = new FormControl();
  public filteredProducts: Observable<Product[]>;
  public ticket: Ticket = new Ticket();

  constructor(public clientService: ClientService, public activatedRoute: ActivatedRoute, public ticketService: TicketService, public router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let id = parseInt(params.get('userId'));

      this.clientService.getClient(id).subscribe(client => {
        this.ticket.user = client;
      });
    });

    this.filteredProducts = this.autocompleteControl.valueChanges.pipe(
      map(value=> typeof value === 'string' ? value: value.name),
      mergeMap(value => value ? this._filter(value): [])
    );
  }

  private _filter(value: string): Observable<Product[]> {
    const filterValue = value.toLowerCase();

    return this.ticketService.filterProducts(filterValue);
  }

  public showName(product ? : Product): string | undefined {
    return product ? product.name : undefined;
  }

  public selectProduct(event: MatAutocompleteSelectedEvent): void {
    let product = event.option.value as Product;

    if(this.itemExists(product.id)) {
      this.quantityIncrement(product.id);
    } else {
      let newItem = new TicketItem();

      newItem.product = product;
      this.ticket.items.push(newItem);
    }

    this.autocompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();
  }

  public updateQuantity(id: number, event: any): void {
    let quantity: number = event.target.value as number;

    if(quantity == 0) {
      return this.deleteTicketItem(id);
    }

    this.ticket.items = this.ticket.items.map((item : TicketItem) => {
      if(id === item.product.id) {
        item.quantity = quantity;
      }

      return item;
    });
  }

  public itemExists(id: number): boolean {
    let exists = false;

    this.ticket.items.forEach((item: TicketItem) => {
      if(id === item.product.id) {
        exists = true;
      } 
    });

    return exists;
  }

  public quantityIncrement(id: number): void {
    this.ticket.items = this.ticket.items.map((item : TicketItem) => {
      if(id === item.product.id) {
        ++item.quantity;
      }

      return item;
    });
  }

  public deleteTicketItem(id: number): void {
    this.ticket.items = this.ticket.items.filter((item: TicketItem) => id !== item.product.id);
  }

  public create(ticketForm: any): void {
    if(this.ticket.items.length == 0) {
      this.autocompleteControl.setErrors({'invalid': true});
    }

    if(ticketForm.form.valid && this.ticket.items.length > 0) {
      this.ticketService.create(this.ticket).subscribe(ticket => {
        Swal.fire("Nueva factura", `Factura ${ ticket.description } creada con éxito!`, 'success');
        this.router.navigate(['/clients']);
      });
    }
  }

}
