import { TicketType } from '../../enums/TicketType.enum';

export default interface ITicketData {
  id: number;
  type: TicketType;
  name: string;
  price: number;
  date: Date;
  cityName: string;
  numberOfRemainingTickets: number;
  numberOfAllTickets: number;
}
