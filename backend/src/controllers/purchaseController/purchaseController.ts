import { NextFunction, Request, Response } from 'express';
import IAddPurchaseDataModel from '../../models/models/dataModels/IAddPurchaseDataModel';
import ICustomResponse from '../../models/responses/ICustomResponse';
import IGetTicketListResponse from '../../models/models/dataModels/IGetMyPurchaseDataModel';
import { jwtService } from '../../services/jwtService/jwt.service';
import { purchaseService } from '../../services/purchaseService/purchaseService';
import IGetTicketResponse from '../../models/responses/IGetTicketResponse';

export const purchaseController = {
  purchase(req: Request, res: Response<ICustomResponse>, next: NextFunction) {
    const { ticketId, count } = req.body;

    const token: string = jwtService.getTokenFromRequest(req) as string;
    const userId: number = jwtService.getUserIdFromToken(token);

    const newPurchases: IAddPurchaseDataModel[] = [];
    for (let i = 0; i < count; i++) {
      newPurchases.push({
        ticketId,
        userId,
        validationCode: 0,
      });
    }

    purchaseService
      .addPurchase(newPurchases)
      .then(_ => {
        res
          .status(201)
          .json({ message: 'Purchases have been successfully added' });
      })
      .catch(err => {
        return next(err);
      });
  },

  getMyPurchases(
    req: Request,
    res: Response<IGetTicketResponse>,
    next: NextFunction,
  ) {
    const token: string = jwtService.getTokenFromRequest(req) as string;
    const userId: number = jwtService.getUserIdFromToken(token);
    const includePast: boolean = req.query.includePast === 'true';
    purchaseService
      .getMyPurchasedTickets(userId, includePast)
      .then(data => {
        res.status(200).json({ ticketList: data });
      })
      .catch(err => {
        return next(err);
      });
  },
};
