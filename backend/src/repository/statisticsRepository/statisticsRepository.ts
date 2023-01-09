import config from '../../config';
import { db } from '../../data/connection';
import IDbResultDataModel from '../../models/models/dataModels/IDbResultDataModel';
import IStatisticsDomainModel from '../../models/models/domainModels/IStatisticsDomainModel';

export const statisticsRepository = {
  createNewStatistics(userId: string): Promise<IDbResultDataModel> {
    return db
      .query<IDbResultDataModel>(
        `INSERT INTO ${config.mysql.database}.statistics (userId) VALUES (?)`,
        [userId],
      )
      .catch(err => Promise.reject(err));
  },

  getStatisticsByUserId(userId: string): Promise<IStatisticsDomainModel> {
    return db
      .query<IStatisticsDomainModel[]>(
        `SELECT * FROM ${config.mysql.database}.statistics WHERE userId = ?`,
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
        `UPDATE ${config.mysql.database}.statistics SET ?? = ?? + 1 WHERE userId = ?`,
        [columnName, columnName, userId],
      )
      .catch(err => Promise.reject(err));
  },
};
