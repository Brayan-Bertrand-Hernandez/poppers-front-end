import { Country } from '../client/country';
import { Ticket } from '../tickets/model/ticket';
import { Role } from './role';

export class User {
    id: number;
    country: Country;
    username: string;
    name: string;
    enabled: boolean;   
    address: string;
    cellphone: string;
    date: string;
    email: string;
    photo: string;
    password: string;
    roles: string[] = [];
    role: Role;
    token: string;
    tickets: Ticket[] = [];
}
