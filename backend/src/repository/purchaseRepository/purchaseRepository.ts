import { createLessThan } from 'typescript';
import { db } from '../../data/connection';
import IAddPurchaseDataModel from '../../models/models/dataModels/IAddPurchaseDataModel';
import IDbResultDataModel from '../../models/models/dataModels/IDbResultDataModel';
import IGetTicketListResponse from '../../models/models/dataModels/IGetMyPurchaseDataModel';
import ITicketDomainModel from '../../models/models/domainModels/ITicketDomainModel';
import { generateMultipleInsertQueryQuestionMarks } from '../repository.helper';

export const purchaseRepository = {
  addPurchase(
    newPurchases: IAddPurchaseDataModel[],
  ): Promise<IDbResultDataModel> {
    return db
      .query<IDbResultDataModel>(
        `INSERT INTO german_app.purchase (ticketId, userId, validationCode)
        VALUES ${generateMultipleInsertQueryQuestionMarks(
          3,
          newPurchases.length,
        )}`,
        newPurchases
          .map(x => [`${x.ticketId}`, `${x.userId}`, `${x.validationCode}`])
          .reduce((acc, val) => acc.concat(val), []),
      )
      .catch(err => Promise.reject(err));
  },

  getMyPurchases(
    userId: number,
    includePast: boolean,
  ): Promise<ITicketDomainModel[]> {
    let query =
      'SELECT p.id, t.type, t.name, t.price, t.date, t.cityName, p.validationCode FROM german_app.purchase p JOIN german_app.ticket t ON p.ticketId = t.id WHERE p.userId = ?';
    if (!includePast) {
      query += ' AND date > now()';
    }
    return db
      .query<ITicketDomainModel[]>(query, [`${userId}`])
      .catch(err => Promise.reject(err));
  },
};
