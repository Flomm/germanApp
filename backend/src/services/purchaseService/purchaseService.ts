import IAddPurchaseDataModel from '../../models/models/dataModels/IAddPurchaseDataModel';
import IGetTicketListResponse from '../../models/models/dataModels/IGetMyPurchaseDataModel';
import ITicketDomainModel from '../../models/models/domainModels/ITicketDomainModel';
import { purchaseRepository } from '../../repository/purchaseRepository/purchaseRepository';
import { ticketRepository } from '../../repository/ticketRepository/ticketRepository';
import { codeGeneratorService } from '../codeGeneratorService/codeGenerator.service';
import {
  notFoundError,
  serverError,
} from '../errorCreatorService/errorCreator.service';

export const purchaseService = {
  addPurchase(newPurchases: IAddPurchaseDataModel[]): Promise<void> {
    for (let purchase of newPurchases) {
      purchase.validationCode = codeGeneratorService.generateSixDigitCode();
    }
    return ticketRepository
      .getTicketById(newPurchases[0].ticketId)
      .then(ticket => {
        if (!ticket) {
          return Promise.reject(notFoundError('Ticket was not found'));
        }
        return purchaseRepository.addPurchase(newPurchases).then(result => {
          if (result && result.affectedRows > 0) {
            return;
          }
          return Promise.reject(serverError('Could not add purchase'));
        });
      })
      .catch(err => Promise.reject(err));
  },

  getMyPurchasedTickets(userId: number, includePast: boolean): Promise<ITicketDomainModel[]> {
    return purchaseRepository
      .getMyPurchases(userId, includePast)
      .catch(err => Promise.reject(err));
  },
};
