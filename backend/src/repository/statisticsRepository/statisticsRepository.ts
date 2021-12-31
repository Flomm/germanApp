import { db } from '../../data/connection';
import IStatisticsDomainModel from '../../models/models/domainModels/IStatisticsDomainModel';

export const statisticsRepository = {
  getStatisticsByUserId(userId: string) {
    return db
      .query<IStatisticsDomainModel[]>(
        'SELECT * FROM german_app.statistics WHERE userId = ?',
        [userId],
      )
      .then(dbResult => dbResult[0])
      .catch(err => Promise.reject(err));
  },
};
