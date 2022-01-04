import app from '../../app';
import request from 'supertest';
import IGetWordsDataModel from '../../models/models/dataModels/IGetWordsDataModel';
import { gameService } from '../../services/gameService/gameService';
import { jwtService } from '../../services/jwtService/jwt.service';
import { serverError } from '../../services/errorCreatorService/errorCreator.service';

const mockDeWords: IGetWordsDataModel[] = [
  {
    id: 1,
    word: 'Wasser',
  },
];

const mockHunWords: IGetWordsDataModel[] = [
  {
    id: 1,
    word: 'víz',
  },
];

const token: string =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiZmJnZXJhem9sQGdtYWlsLmNvbSIsInJvbGVJZCI6MiwiaWF0IjoxNjQxMzE1NDM5LCJleHAiOjE2NDEzMTkwMzl9.c2w8OdrzlLLJ5cS54dbL9fyM_Kf56s2AZGvX2O_xt94';

describe('GET /random-words', () => {
  test('succesfully retrieved random german words', async () => {
    //Arrange
    gameService.getRandomWords = jest.fn().mockResolvedValue(mockDeWords);
    jwtService.verifyToken = jest.fn().mockResolvedValue(true);

    //Act
    const response = await request(app)
      .get('/api/game/random-words/de/?quantity=10')
      .set({ authorization: `Bearer ${token}` });

    //Assert
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({ wordList: mockDeWords });
    expect(gameService.getRandomWords).toHaveBeenCalledTimes(1);
  });

  test('succesfully retrieved random hungarian words', async () => {
    //Arrange
    gameService.getRandomWords = jest.fn().mockResolvedValue(mockHunWords);
    jwtService.verifyToken = jest.fn().mockResolvedValue(true);

    //Act
    const response = await request(app)
      .get('/api/game/random-words/de/?quantity=10')
      .set({ authorization: `Bearer ${token}` });

    //Assert
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({ wordList: mockHunWords });
    expect(gameService.getRandomWords).toHaveBeenCalledTimes(1);
  });

  test('invalid language', async () => {
    //Arrange
    console.error = jest.fn();

    //Act
    const response = await request(app)
      .get('/api/game/random-words/test/?quantity=10')
      .set({ authorization: `Bearer ${token}` });

    //Assert
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({
      message: 'Nincs ilyen nyelv a szótárban.',
    });
  });

  test('invalid quantity', async () => {
    //Arrange
    console.error = jest.fn();

    //Act
    const response = await request(app)
      .get('/api/game/random-words/de/?quantity=test')
      .set({ authorization: `Bearer ${token}` });

    //Assert
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({
      message: 'Érvénytelen szómennyiség.',
    });
  });

  test('error in the service', async () => {
    //Arrange
    gameService.getRandomWords = jest
      .fn()
      .mockRejectedValue(serverError('test'));
    console.error = jest.fn();

    //Act
    const response = await request(app)
      .get('/api/game/random-words/de/?quantity=10')
      .set({ authorization: `Bearer ${token}` });

    //Assert
    expect(response.statusCode).toEqual(500);
    expect(response.body).toEqual({ message: 'test' });
    expect(gameService.getRandomWords).toHaveBeenCalledTimes(1);
  });
});
