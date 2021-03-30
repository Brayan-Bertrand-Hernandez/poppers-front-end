import { Component } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html',
  styleUrls: ['./directiva.component.css']
})
export class DirectivaComponent {
  membersList: string[] = ['Brayan Bertrand Hernandez', 'Bryan Emmanuel Ramos Avalos', 'Gustavo Quintero Corrales'];

  enabled: boolean = true;

  setEnabled(): void {
    this.enabled = (this.enabled == true) ? false : true;
  }
}
