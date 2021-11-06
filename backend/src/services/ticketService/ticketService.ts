import IUpdateTicketDataModel from '../../models/models/dataModels/IUpdateTicketDataModel';
import IAddTicketDataModel from '../../models/models/dataModels/IAddTicketDataModel';
import { ticketRepository } from '../../repository/ticketRepository/ticketRepository';
import {
  notFoundError,
  serverError,
} from '../errorCreatorService/errorCreator.service';
import ITicketDomainModel from '../../models/models/domainModels/ITicketDomainModel';

export const ticketService = {
  getTickets(): Promise<ITicketDomainModel[]> {
    return ticketRepository.getTickets().catch(err => Promise.reject(err));
  },

  addTicket(newTicket: IAddTicketDataModel): Promise<void> {
    return ticketRepository
      .addTicket(newTicket)
      .then(result => {
        if (result && result.affectedRows > 0) {
          return;
        }
        return Promise.reject(serverError('Could not add the ticket'));
      })
      .catch(err => Promise.reject(err));
  },

  removeTicket(ticketId: number): Promise<void> {
    return ticketRepository.removeTicket(ticketId).then(dbResult => {
      if (dbResult.affectedRows === 0) {
        return Promise.reject(notFoundError('This ticket Id is not found'));
      }
    });
  },

  updateTicket(modifiedTicket: IUpdateTicketDataModel): Promise<void> {
    return ticketRepository
      .updateTicket(modifiedTicket)
      .then(result => {
        if (result && result.affectedRows > 0) {
          return;
        }
        return Promise.reject(serverError('Could not update the ticket'));
      })
      .catch(err => Promise.reject(err));
  },
  
  getFutureTickets(): Promise<ITicketDomainModel[]> {
    return ticketRepository
      .getFutureTickets()
      .catch(err => Promise.reject(err));
  },
};
