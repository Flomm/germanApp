import ITicketDomainModel from '../models/domainModels/ITicketDomainModel';

export default interface IGetTicketResponse {
  ticketList: ITicketDomainModel[];
}
