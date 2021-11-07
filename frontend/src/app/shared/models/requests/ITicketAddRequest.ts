import { TicketType } from '../enums/TicketType.enum';

export default interface ITicketAddRequest {
  type: TicketType;
  name: string;
  price: number;
  date: Date;
  cityName: string;
  numberOfAllTickets: number;
}
