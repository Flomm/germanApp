import IDbResultDataModel from '../../models/models/dataModels/IDbResultDataModel';
import IStatisticsDomainModel from '../../models/models/domainModels/IStatisticsDomainModel';
import { StatDataType } from '../../models/models/Enums/StatDataType.enum';
import { statisticsRepository } from '../../repository/statisticsRepository/statisticsRepository';
import {
  badRequestError,
  notFoundError,
  serverError,
} from '../errorCreatorService/errorCreatorService';
import { statisticsService } from './statisticsService';

const mockUserId = '1';

const mockDbResult: IDbResultDataModel = {
  affectedRows: 1,
};

describe('getMyStatistics', () => {
  const mockStatisticsData: IStatisticsDomainModel = {
    userId: 1,
    numOfCorrectAnswers: 0,
    numOfIncorrectAnswers: 0,
    numOfFinishedGames: 0,
    numOfStartedGames: 0,
  };

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

describe('incrementStatData', () => {
  test('successfully incrementing SG data', async () => {
    //Arrange
    statisticsRepository.incrementData = jest
      .fn()
      .mockResolvedValue(mockDbResult);

    //Act
    await statisticsService.incrementStatData(mockUserId, StatDataType.SG);
    //Assert

    expect(statisticsRepository.incrementData).toHaveBeenCalledWith(
      mockUserId,
      'numOfStartedGames',
    );
  });

  test('successfully incrementing CA data', async () => {
    //Arrange
    statisticsRepository.incrementData = jest
      .fn()
      .mockResolvedValue(mockDbResult);

    //Act
    await statisticsService.incrementStatData(mockUserId, StatDataType.CA);
    //Assert

    expect(statisticsRepository.incrementData).toHaveBeenCalledWith(
      mockUserId,
      'numOfCorrectAnswers',
    );
  });

  test('should create notFoundError if affectedrows is 0', async () => {
    //Arrange
    statisticsRepository.incrementData = jest
      .fn()
      .mockResolvedValue(mockDbResult);

    //Act
    try {
      await statisticsService.incrementStatData(mockUserId, StatDataType.SG);
    } catch (err) {
      //Assert
      expect(err).toEqual(notFoundError('A módosítás nem sikerült.'));
      expect(statisticsRepository.incrementData).toHaveBeenCalledWith(
        mockUserId,
        'numOfStartedGames',
      );
    }
  });

  test('should create badRequestError if dataType is invalid', async () => {
    //Arrange
    statisticsRepository.incrementData = jest.fn();
    //Act
    try {
      await statisticsService.incrementStatData(mockUserId, 12);
    } catch (err) {
      //Assert
      expect(err).toEqual(badRequestError('Érvénytelen adattípus azonosító.'));
      expect(statisticsRepository.incrementData).not.toHaveBeenCalled();
    }
  });

  test('repository error', async () => {
    //Arrange
    statisticsRepository.incrementData = jest
      .fn()
      .mockRejectedValue(serverError('test'));

    //Act
    try {
      await statisticsService.incrementStatData(mockUserId, StatDataType.SG);
    } catch (err) {
      //Assert
      expect(err).toEqual(serverError('test'));
      expect(statisticsRepository.incrementData).toHaveBeenCalledWith(
        mockUserId,
        'numOfStartedGames',
      );
    }
  });
});
