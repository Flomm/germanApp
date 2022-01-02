import IStatisticsDomainModel from '../../models/models/domainModels/IStatisticsDomainModel';
import { StatDataType } from '../../models/models/Enums/StatDataType.enum';
import { statisticsRepository } from '../../repository/statisticsRepository/statisticsRepository';
import {
  badRequestError,
  notFoundError,
} from '../errorCreatorService/errorCreator.service';

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

  incrementStatData(userId: string, dataType: StatDataType): Promise<void> {
    let dataTypeString: string;
    switch (dataType) {
      case StatDataType.SG:
        dataTypeString = 'numOfStartedGames';
        break;
      case StatDataType.FG:
        dataTypeString = 'numOfFinishedGames';
        break;
      case StatDataType.CA:
        dataTypeString = 'numOfCorrectAnswers';
        break;
      case StatDataType.IA:
        dataTypeString = 'numOfIncorrectAnswers';
        break;
      default:
        return Promise.reject(
          badRequestError('Érvénytelen adattípus azonosító.'),
        );
    }

    return statisticsRepository
      .incrementData(userId, dataTypeString)
      .then(dbResult => {
        if (dbResult?.affectedRows === 0) {
          return Promise.reject(notFoundError('A módosítás nem sikerült.'));
        }
      })
      .catch(err => Promise.reject(err));
  },
};
