import { db } from '../../data/connection';
import IDbResultDataModel from '../../models/models/dataModels/IDbResultDataModel';
import IStatisticsDomainModel from '../../models/models/domainModels/IStatisticsDomainModel';

export const statisticsRepository = {
  getStatisticsByUserId(userId: string): Promise<IStatisticsDomainModel> {
    return db
      .query<IStatisticsDomainModel[]>(
        'SELECT * FROM german_app.statistics WHERE userId = ?',
        [userId],
      )
      .then(dbResult => dbResult[0])
      .catch(err => Promise.reject(err));
  },

  incrementData(
    userId: string,
    columnName: string,
  ): Promise<IDbResultDataModel> {
    return db
      .query<IDbResultDataModel>(
        'UPDATE german_app.statistics SET ?? = ?? + 1 WHERE userId = ?',
        [columnName, columnName, userId],
      )
      .catch(err => Promise.reject(err));
  },
};
