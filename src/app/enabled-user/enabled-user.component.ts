import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientService } from '../client/client.service';
import { User } from '../user/user';

@Component({
  selector: 'app-enabled-user',
  templateUrl: './enabled-user.component.html',
  styleUrls: ['./enabled-user.component.css']
})
export class EnabledUserComponent implements OnInit {
  public client: User;

  constructor(public activatedRoute: ActivatedRoute, public clientService: ClientService) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let email = params.get('email');

      console.log(email);

      this.clientService.activateAccount(email).subscribe(client => {
        this.client = client;
      });
    });
  }

}
