import { TicketType } from '../enums/TicketType.enum';

export default interface IUpdateTicketDataModel {
  ticketId: number;
  type: TicketType;
  name: string;
  price: number;
  date: Date;
  cityName: string;
  numberOfAllTickets: number;
}
