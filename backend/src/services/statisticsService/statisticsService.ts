import IStatisticsDomainModel from '../../models/models/domainModels/IStatisticsDomainModel';
import { statisticsRepository } from '../../repository/statisticsRepository/statisticsRepository';
import { notFoundError } from '../errorCreatorService/errorCreator.service';

export const statisticsService = {
  getMyStatistics(id: string): Promise<IStatisticsDomainModel> {
    return statisticsRepository
      .getStatisticsByUserId(id)
      .then(statData => {
        if (!statData) {
          return Promise.reject(notFoundError('A felhasználó nem létezik.'));
        }
        return statData;
      })
      .catch(err => Promise.reject(err));
  },
};
