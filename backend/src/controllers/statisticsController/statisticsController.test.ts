import app from '../../app';
import request from 'supertest';
import IStatisticsDomainModel from '../../models/models/domainModels/IStatisticsDomainModel';
import { serverError } from '../../services/errorCreatorService/errorCreator.service';
import { statisticsService } from '../../services/statisticsService/statisticsService';
import { jwtService } from '../../services/jwtService/jwt.service';
import { StatDataType } from '../../models/models/Enums/StatDataType.enum';
import IIncrementStatDataRequest from '../../models/requests/IIncrementStatDataRequest';

const token: string =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsInJvbGVJZCI6MSwiaWF0IjoxNjI1ODU2Mzc5LCJleHAiOjE2MjU4NTk5Nzl9.q1O5nZgju0sO-ORTxiO745KkofE7nnFr0YsMML6Uuas';

const mockUserId: string = '1';

describe('GET /my-statistics', () => {
  const mockStatisticsData: IStatisticsDomainModel = {
    userId: 1,
    numOfCorrectAnswers: 0,
    numOfIncorrectAnswers: 0,
    numOfFinishedGames: 0,
    numOfStartedGames: 0,
  };

  test('succesfully retrieved statistics data', async () => {
    //Arrange
    statisticsService.getMyStatistics = jest
      .fn()
      .mockResolvedValue(mockStatisticsData);
    jwtService.verifyToken = jest.fn().mockResolvedValue(true);
    console.error = jest.fn();

    //Act
    const response = await request(app)
      .get('/api/statistics/my-statistics')
      .set({ authorization: `Bearer ${token}` });

    //Assert
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({ statistics: mockStatisticsData });
    expect(statisticsService.getMyStatistics).toHaveBeenCalledWith(mockUserId);
  });

  test('error in the service', async () => {
    //Arrange
    statisticsService.getMyStatistics = jest
      .fn()
      .mockRejectedValue(serverError('test'));
    console.error = jest.fn();

    //Act
    const response = await request(app)
      .get('/api/statistics/my-statistics')
      .set({ authorization: `Bearer ${token}` });

    //Assert
    expect(response.statusCode).toEqual(500);
    expect(response.body).toEqual({ message: 'test' });
    expect(statisticsService.getMyStatistics).toHaveBeenCalledWith(mockUserId);
  });
});

describe('PUT /increment/:dataType', () => {
  test('successfully updating SG stat data', async () => {
    //Arrange
    statisticsService.incrementStatData = jest
      .fn()
      .mockResolvedValue(Promise.resolve);
    const mockBody: IIncrementStatDataRequest = { dataType: StatDataType.SG };

    //Act
    const response = await request(app)
      .put('/api/statistics/increment')
      .set({ authorization: `Bearer ${token}` })
      .send(mockBody);

    //Assert
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      message: 'Adat sikeresen módosítva.',
    });
    expect(statisticsService.incrementStatData).toHaveBeenCalledWith(
      mockUserId,
      StatDataType.SG,
    );
  });

  test('successfully updating CA stat data', async () => {
    //Arrange
    statisticsService.incrementStatData = jest
      .fn()
      .mockResolvedValue(Promise.resolve);
    const mockBody: IIncrementStatDataRequest = { dataType: StatDataType.CA };

    //Act
    const response = await request(app)
      .put('/api/statistics/increment')
      .set({ authorization: `Bearer ${token}` })
      .send(mockBody);

    //Assert
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      message: 'Adat sikeresen módosítva.',
    });
    expect(statisticsService.incrementStatData).toHaveBeenCalledWith(
      mockUserId,
      StatDataType.CA,
    );
  });

  test('should send back 400 error if body.dataType is not an integer', async () => {
    //Arrange
    statisticsService.incrementStatData = jest
      .fn()
      .mockResolvedValue(Promise.resolve);
    const mockBody: object = { dataType: 'test' };

    //Act
    const response = await request(app)
      .put('/api/statistics/increment')
      .set({ authorization: `Bearer ${token}` })
      .send(mockBody);

    //Assert
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({
      message: 'Érvénytelen adattípus azonosító.',
    });
  });

  test('should send back 400 error if body.dataType is not in range of 1-4', async () => {
    //Arrange
    statisticsService.incrementStatData = jest
      .fn()
      .mockResolvedValue(Promise.resolve);
    const mockBody: IIncrementStatDataRequest = { dataType: 15 };

    //Act
    const response = await request(app)
      .put('/api/statistics/increment')
      .set({ authorization: `Bearer ${token}` })
      .send(mockBody);

    //Assert
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({
      message: 'Érvénytelen adattípus azonosító.',
    });
  });

  test('error in the service', async () => {
    //Arrange
    statisticsService.incrementStatData = jest
      .fn()
      .mockRejectedValue(serverError('test'));
    const mockBody: IIncrementStatDataRequest = { dataType: StatDataType.SG };

    //Act
    const response = await request(app)
      .put('/api/statistics/increment')
      .set({ authorization: `Bearer ${token}` })
      .send(mockBody);

    //Assert
    expect(response.statusCode).toEqual(500);
    expect(response.body).toEqual({ message: 'test' });
    expect(statisticsService.incrementStatData).toHaveBeenCalledWith(
      mockUserId,
      StatDataType.SG,
    );
  });
});
