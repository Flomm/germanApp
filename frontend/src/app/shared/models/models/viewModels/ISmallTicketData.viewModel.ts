import { TicketType } from '../../enums/TicketType.enum';

export default interface ISmallTicketData {
  id: number;
  type: TicketType;
  name: string;
  price: number;
  count: number;
}
