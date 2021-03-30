import { User } from 'src/app/user/user';
import { TicketItem } from './ticket-item';

export class Ticket {
    id: number;
    description: string;
    comment: string;
    items: TicketItem[] = [];
    user: User;
    total: number;
    date: string;
    checked: boolean;
    pdf: any;

    public calculateGrantTotal(): number {
        this.total = 0;

        this.items.forEach((item: TicketItem) => {
            this.total += item.calculateAmount();
        });

        return this.total;
    } 
}
