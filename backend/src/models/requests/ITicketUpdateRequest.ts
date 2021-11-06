import { TicketType } from '../models/enums/TicketType.enum';

export default interface ITicketUpdateRequest {
  ticketId: number;
  type: TicketType;
  name: string;
  price: number;
  date: Date;
  cityName: string;
  numberOfAllTickets: number;
}
