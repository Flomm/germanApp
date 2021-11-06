import { TicketType } from '../enums/TicketType.enum';

export default interface ITicketDomainModel {
  id: number;
  type: TicketType;
  name: string;
  price: number;
  date: Date;
  cityName: string;
  numberOfAllTickets: number;
}
