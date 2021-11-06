import { TicketType } from '../enums/TicketType.enum';

export default interface IAddTicketDataModel {
  type: TicketType;
  name: string;
  price: number;
  date: Date;
  cityName: string;
  numberOfAllTickets: number;
}
