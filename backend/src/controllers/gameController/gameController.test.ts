import app from '../../app';
import request from 'supertest';
import IGetWordsDataModel from '../../models/models/dataModels/IGetWordsDataModel';
import { gameService } from '../../services/gameService/gameService';
import { jwtService } from '../../services/jwtService/jwt.service';
import { serverError } from '../../services/errorCreatorService/errorCreator.service';
import ICheckAnswerResponse from '../../models/responses/ICheckAnswerResponse';
import ICheckAnswerRequest from '../../models/requests/ICheckAnswerRequest';
import { TopicType } from '../../models/models/Enums/TopicType.enum';

const mockDeWords: IGetWordsDataModel[] = [
  {
    id: 1,
    word: 'Wasser',
    topic: TopicType.FAMILY,
  },
];

const mockHunWords: IGetWordsDataModel[] = [
  {
    id: 1,
    word: 'víz',
    topic: TopicType.FAMILY,
  },
];

const mockCheckAnswerRequest: ICheckAnswerRequest = {
  wordId: 1,
  answerList: [{ answer: 'test' }],
};

const mockCheckAnswerResponse: ICheckAnswerResponse = {
  isCorrect: true,
  translations: [{ translation: 'test' }],
};

const token: string =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUsImVtYWlsIjoiZmJnZXJhem9sQGdtYWlsLmNvbSIsInJvbGVJZCI6MiwiaWF0IjoxNjQxMzE1NDM5LCJleHAiOjE2NDEzMTkwMzl9.c2w8OdrzlLLJ5cS54dbL9fyM_Kf56s2AZGvX2O_xt94';

describe('POST /random-words', () => {
  test('succesfully retrieved random german words', async () => {
    //Arrange
    gameService.getRandomWords = jest.fn().mockResolvedValue(mockDeWords);
    jwtService.verifyToken = jest.fn().mockResolvedValue(true);

    //Act
    const response = await request(app)
      .post('/api/game/random-words/de/?quantity=10')
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
      .post('/api/game/random-words/de/?quantity=10')
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
      .post('/api/game/random-words/test/?quantity=10')
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
      .post('/api/game/random-words/de/?quantity=test')
      .set({ authorization: `Bearer ${token}` });

    //Assert
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({
      message: 'Érvénytelen szómennyiség.',
    });
  });

  test('invalid topic', async () => {
    //Arrange
    console.error = jest.fn();

    //Act
    const response = await request(app)
      .post('/api/game/random-words/de/?quantity=10')
      .set({ authorization: `Bearer ${token}` })
      .send({ topics: [1, 122] });

    //Assert
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({
      message: 'Érvénytelen téma azonosító.',
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
      .post('/api/game/random-words/de/?quantity=10')
      .set({ authorization: `Bearer ${token}` });

    //Assert
    expect(response.statusCode).toEqual(500);
    expect(response.body).toEqual({ message: 'test' });
    expect(gameService.getRandomWords).toHaveBeenCalledTimes(1);
  });
});

describe('POST /check-answers', () => {
  test('succesfully checked an answer for German word', async () => {
    //Arrange
    gameService.checkAnswer = jest
      .fn()
      .mockResolvedValue(mockCheckAnswerResponse);
    jwtService.verifyToken = jest.fn().mockResolvedValue(true);

    //Act
    const response = await request(app)
      .post('/api/game/check-answer/de')
      .set({ authorization: `Bearer ${token}` })
      .send(mockCheckAnswerRequest);

    //Assert
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(mockCheckAnswerResponse);
    expect(gameService.checkAnswer).toHaveBeenCalledTimes(1);
  });

  test('succesfully checked an answer for Hungarian word', async () => {
    //Arrange
    gameService.checkAnswer = jest
      .fn()
      .mockResolvedValue(mockCheckAnswerResponse);
    jwtService.verifyToken = jest.fn().mockResolvedValue(true);

    //Act
    const response = await request(app)
      .post('/api/game/check-answer/hu')
      .set({ authorization: `Bearer ${token}` })
      .send(mockCheckAnswerRequest);

    //Assert
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(mockCheckAnswerResponse);
    expect(gameService.checkAnswer).toHaveBeenCalledTimes(1);
  });

  test('invalid language', async () => {
    //Arrange
    console.error = jest.fn();

    //Act
    const response = await request(app)
      .post('/api/game/check-answer/test')
      .set({ authorization: `Bearer ${token}` })
      .send(mockCheckAnswerRequest);

    //Assert
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({
      message: 'Nincs ilyen nyelv a szótárban.',
    });
  });

  test('error in the service', async () => {
    //Arrange
    gameService.checkAnswer = jest.fn().mockRejectedValue(serverError('test'));
    console.error = jest.fn();

    //Act
    const response = await request(app)
      .post('/api/game/check-answer/de')
      .set({ authorization: `Bearer ${token}` })
      .send(mockCheckAnswerRequest);

    //Assert
    expect(response.statusCode).toEqual(500);
    expect(response.body).toEqual({ message: 'test' });
    expect(gameService.checkAnswer).toHaveBeenCalledTimes(1);
  });
});
