import IStatisticsDomainModel from '../../models/models/domainModels/IStatisticsDomainModel';
import { statisticsRepository } from '../../repository/statisticsRepository/statisticsRepository';
import {
  notFoundError,
  serverError,
} from '../errorCreatorService/errorCreator.service';
import { statisticsService } from './statisticsService';

describe('getMyStatistics', () => {
  const mockStatisticsData: IStatisticsDomainModel = {
    userId: 1,
    numOfCorrectAnswers: 0,
    numOfIncorrectAnswers: 0,
    numOfFinishedGames: 0,
    numOfStartedGames: 0,
  };
  const mockUserId: string = '1';

  test('successfully retrieved statistics data', async () => {
    //Arrange
    statisticsRepository.getStatisticsByUserId = jest
      .fn()
      .mockResolvedValue(mockStatisticsData);

    //Act
    const statData = await statisticsService.getMyStatistics(mockUserId);

    //Assert
    expect(statData).toStrictEqual(mockStatisticsData);
    expect(statisticsRepository.getStatisticsByUserId).toHaveBeenLastCalledWith(
      mockUserId,
    );
  });

  test('User not found', async () => {
    //Arrange
    statisticsRepository.getStatisticsByUserId = jest
      .fn()
      .mockResolvedValue(undefined);

    //Act
    try {
      await statisticsService.getMyStatistics(mockUserId);
    } catch (err) {
      //Assert
      expect(err).toEqual(notFoundError('A felhasználó nem létezik.'));
      expect(
        statisticsRepository.getStatisticsByUserId,
      ).toHaveBeenLastCalledWith(mockUserId);
    }
  });

  test('repository error', async () => {
    //Arrange
    statisticsRepository.getStatisticsByUserId = jest
      .fn()
      .mockRejectedValue(serverError('test'));

    //Act
    try {
      await statisticsService.getMyStatistics(mockUserId);
    } catch (err) {
      //Assert
      expect(err).toEqual(serverError('test'));
      expect(
        statisticsRepository.getStatisticsByUserId,
      ).toHaveBeenLastCalledWith(mockUserId);
    }
  });
});
