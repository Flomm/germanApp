import { db } from '../../data/connection';
import IDbResultDataModel from '../../models/models/dataModels/IDbResultDataModel';
import ISubscriptionDataModel from '../../models/models/dataModels/ISubscriptionDataModel';
import ISubscriptionDomainModel from '../../models/models/domainModels/ISubscriptionDomainModel';

export const subscriptionRepository = {
  getSubscriptionByEmail(email: string): Promise<ISubscriptionDomainModel> {
    return db
      .query<ISubscriptionDomainModel[]>(
        'SELECT * FROM german_app.subscription WHERE email = ?',
        [email],
      )
      .then(dbResult => dbResult[0])
      .catch(err => Promise.reject(err));
  },
  createSubscription(
    subscription: ISubscriptionDataModel,
  ): Promise<IDbResultDataModel> {
    return db
      .query<IDbResultDataModel>(
        `INSERT INTO german_app.subscription (name, email)
    VALUES (?, ?)`,
        [subscription.name, subscription.email],
      )
      .catch(err => Promise.reject(err));
  },
};
