import { db } from '../../data/connection';
import ITicketDomainModel from '../../models/models/domainModels/ITicketDomainModel';
import IUpdateTicketDataModel from '../../models/models/dataModels/IUpdateTicketDataModel';
import IDbResultDataModel from '../../models/models/dataModels/IDbResultDataModel';
import IAddTicketDataModel from '../../models/models/dataModels/IAddTicketDataModel';

export const ticketRepository = {
  getTickets(): Promise<ITicketDomainModel[]> {
    return db.query<ITicketDomainModel[]>('SELECT * FROM foxticket.ticket', []);
  },
  
  addTicket(newTicket: IAddTicketDataModel): Promise<IDbResultDataModel> {
    return db
      .query<IDbResultDataModel>(
        `INSERT INTO foxticket.ticket (type, name, price, date, cityName, numberOfAllTickets)
    VALUES (?, ?, ?, ?, ?, ?)`,
        [
          `${newTicket.type}`,
          newTicket.name,
          `${newTicket.price}`,
          `${newTicket.date.toString().slice(0, 16).replace('T', ' ')}`,
          newTicket.cityName,
          `${newTicket.numberOfAllTickets}`,
        ],
      )
      .catch(err => Promise.reject(err));
  },

  removeTicket(ticketId: number): Promise<IDbResultDataModel> {
    return db.query<IDbResultDataModel>(
      'DELETE FROM foxticket.ticket WHERE id = ?',
      [`${ticketId}`],
    );
  },

  getTicketById(ticketId: number): Promise<ITicketDomainModel> {
    return db.query<ITicketDomainModel[]>(
      'SELECT * FROM foxticket.ticket WHERE id = ?',
      [`${ticketId}`],
    )
    .then(tickets => tickets[0])
    .catch(err => Promise.reject(err));
  },

  updateTicket(
    modifiedTicket: IUpdateTicketDataModel,
  ): Promise<IDbResultDataModel> {
    return db
      .query<IDbResultDataModel>(
        'UPDATE foxticket.ticket SET type = ?, name = ?, price = ?, date = ?, cityName = ?, numberOfAllTickets = ? WHERE id = ?',
        [
          `${modifiedTicket.type}`,
          modifiedTicket.name,
          `${modifiedTicket.price}`,
          `${modifiedTicket.date.toString().slice(0, 16).replace('T', ' ')}`,
          modifiedTicket.cityName,
          `${modifiedTicket.numberOfAllTickets}`,
          `${modifiedTicket.ticketId}`,
        ],
      )
      .catch(err => Promise.reject(err));
  },
  getFutureTickets(): Promise<ITicketDomainModel[]> {
    return db.query<ITicketDomainModel[]>(
      'SELECT * FROM foxticket.ticket WHERE date > now()',
      [],
    );
  },
};
