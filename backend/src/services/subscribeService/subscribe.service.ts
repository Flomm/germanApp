import ISubscriptionDataModel from '../../models/models/dataModels/ISubscriptionDataModel';
import { subscriptionRepository } from '../../repository/subscribeRepository/subscribeRepository';
import {
  conflictError,
  serverError,
} from '../errorCreatorService/errorCreator.service';


export const subscriptionService = {
  createSubscription(subscription: ISubscriptionDataModel): Promise<void> {
    return subscriptionRepository
      .getSubscriptionByEmail(subscription.email)
      .then(async email => {
        if (email) {
          return Promise.reject(conflictError('This email already exists'));
        }
        const newSubscription: ISubscriptionDataModel = {
          name: subscription.name,
          email: subscription.email,
        };
        return await subscriptionRepository.createSubscription(newSubscription);
      })
      .then(dbResult => {
        if (dbResult && dbResult.affectedRows > 0) {
          return;
        }
        return Promise.reject(serverError('Cannot insert user'));
      })
      .catch(err => Promise.reject(err));
  },
};
