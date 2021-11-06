import { subscriptionService } from '../../services/subscribeService/subscribe.service';
import { NextFunction, Request, Response } from 'express';
import ISubscriptionRequest from '../../models/requests/ISubscriptionRequest';
import ICustomResponse from '../../models/responses/ICustomResponse';
import ISubscriptionDataModel from '../../models/models/dataModels/ISubscriptionDataModel';


export const subscriptionController = {
  async createSubscription(
    req: Request<ISubscriptionRequest>,
    res: Response<ICustomResponse>,
    next: NextFunction,
  ) {
    const newSubscription: ISubscriptionDataModel = {
      name: req.body.name,
      email: req.body.email,
    };

    subscriptionService
      .createSubscription(newSubscription)
      .then(_ => {
        res.status(201).json({ message: 'Subscription was successful' });
      })
      .catch(err => {
        next(err);
        return;
      });
  },
};
