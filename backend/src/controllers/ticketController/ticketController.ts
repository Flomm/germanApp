import { Request, Response, NextFunction } from 'express';
import { ticketService } from '../../services/ticketService/ticketService';
import ITicketAddRequest from '../../models/requests/ITicketAddRequest';
import IAddTicketDataModel from '../../models/models/dataModels/IAddTicketDataModel';
import ICustomResponse from '../../models/responses/ICustomResponse';
import IUpdateTicketDataModel from '../../models/models/dataModels/IUpdateTicketDataModel';
import ITicketUpdateRequest from '../../models/requests/ITicketUpdateRequest';
import { badRequestError } from '../../services/errorCreatorService/errorCreator.service';
import { UserRole } from '../../models/models/enums/UserRole.enum';
import { jwtService } from '../../services/jwtService/jwt.service';
import IGetTicketResponse from '../../models/responses/IGetTicketResponse';

export const ticketController = {
  getTickets(
    req: Request,
    res: Response<IGetTicketResponse>,
    next: NextFunction,
  ) {
    const token: string = jwtService.getTokenFromRequest(req) as string;
    const currentUserRole: UserRole = jwtService.getUserRoleFromToken(token);

    if (currentUserRole !== UserRole.Admin) {
      ticketService
        .getFutureTickets()
        .then(tickets => {
          res.status(200).json({ ticketList: tickets });
        })
        .catch(err => {
          next(err);
          return;
        });
    } else {
      ticketService
        .getTickets()
        .then(tickets => {
          res.status(200).json({ ticketList: tickets });
        })
        .catch(err => {
          next(err);
          return;
        });
    }
  },

  async addTicket(
    req: Request<ITicketAddRequest>,
    res: Response<ICustomResponse>,
    next: NextFunction,
  ) {
    const newTicket: IAddTicketDataModel = req.body;

    ticketService
      .addTicket(newTicket)
      .then(_ => {
        res.status(201).json({ message: 'Ticket has been successfully added' });
      })
      .catch(err => {
        return next(err);
      });
  },

  async removeTicket(req: Request, res: Response, next: NextFunction) {
    const ticketId = parseInt(req.params.id);

    if (isNaN(ticketId) || ticketId < 1) {
      return next(badRequestError('Ticket id needs to be a positive integer'));
    }
    ticketService
      .removeTicket(ticketId)
      .then(_ => {
        res
          .status(200)
          .json({ message: 'Ticket has been removed successfully' });
      })
      .catch(err => {
        next(err);
        return;
      });
  },

  async updateTicket(
    req: Request<ITicketUpdateRequest>,
    res: Response<ICustomResponse>,
    next: NextFunction,
  ) {
    if (isNaN(req.params.ticketId) || req.params.ticketId < 1) {
      return next(badRequestError('Ticket id needs to be a positive integer'));
    }

    const modifiedTicket: IUpdateTicketDataModel = {
      ...req.body,
      ticketId: req.params.ticketId,
    };

    ticketService
      .updateTicket(modifiedTicket)
      .then(_ => {
        res
          .status(200)
          .json({ message: 'Ticket has been succesfully updated' });
      })
      .catch(err => {
        return next(err);
      });
  },
};
