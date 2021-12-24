import app from '../../app';
import request from 'supertest';
import ITranslationDataModel from '../../models/models/dataModels/ITranslationDataModel';
import { Gender } from '../../models/models/Enums/Gender.enum';
import { jwtService } from '../../services/jwtService/jwt.service';
import { translationService } from '../../services/translationService/translationService';
import { serverError } from '../../services/errorCreatorService/errorCreator.service';

const mockTranslationList: ITranslationDataModel[] = [
  { translation: 'test', gender: Gender.DER },
  { translation: 'test2' },
];

const token: string =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsInJvbGVJZCI6MSwiaWF0IjoxNjI1ODU2Mzc5LCJleHAiOjE2MjU4NTk5Nzl9.q1O5nZgju0sO-ORTxiO745KkofE7nnFr0YsMML6Uuas';

describe('GET /id', () => {
  test('succesfully retrieved translations for german word', async () => {
    //Arrange
    translationService.getTranslationsByWordId = jest
      .fn()
      .mockResolvedValue(mockTranslationList);
    jwtService.verifyToken = jest.fn().mockResolvedValue(true);

    //Act
    const response = await request(app)
      .get('/api/translation/de/1')
      .set({ authorization: `Bearer ${token}` });

    //Assert
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({ translationList: mockTranslationList });
    expect(translationService.getTranslationsByWordId).toHaveBeenCalledTimes(1);
  });

  test('succesfully retrieved translations for hungarian word', async () => {
    //Arrange
    translationService.getTranslationsByWordId = jest
      .fn()
      .mockResolvedValue(mockTranslationList);
    jwtService.verifyToken = jest.fn().mockResolvedValue(true);

    //Act
    const response = await request(app)
      .get('/api/translation/hu/1')
      .set({ authorization: `Bearer ${token}` });

    //Assert
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({ translationList: mockTranslationList });
    expect(translationService.getTranslationsByWordId).toHaveBeenCalledTimes(1);
  });

  test('invalid language', async () => {
    //Arrange
    console.error = jest.fn();

    //Act
    const response = await request(app)
      .get('/api/translation/lol/1')
      .set({ authorization: `Bearer ${token}` });

    //Assert
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({
      message: 'Nincs ilyen nyelv a szótárban.',
    });
  });

  test('invalid id', async () => {
    //Arrange
    console.error = jest.fn();

    //Act
    const response = await request(app)
      .get('/api/translation/de/test')
      .set({ authorization: `Bearer ${token}` });

    //Assert
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({
      message: 'A szó id pozitív egész szám kell legyen.',
    });
  });

  test('error in the service', async () => {
    //Arrange
    translationService.getTranslationsByWordId = jest
      .fn()
      .mockRejectedValue(serverError('test'));
    console.error = jest.fn();

    //Act
    const response = await request(app)
      .get('/api/translation/de/1')
      .set({ authorization: `Bearer ${token}` });

    //Assert
    expect(response.statusCode).toEqual(500);
    expect(response.body).toEqual({ message: 'test' });
    expect(translationService.getTranslationsByWordId).toHaveBeenCalledTimes(1);
  });
});
