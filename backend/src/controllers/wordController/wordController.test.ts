import app from '../../app';
import request from 'supertest';
import { jwtService } from '../../services/jwtService/jwtService';
import { wordService } from '../../services/wordService/wordService';
import IGetWordsDataModel from '../../models/models/dataModels/IGetWordsDataModel';
import { serverError } from '../../services/errorCreatorService/errorCreatorService';
import IAddWordDataModel from '../../models/models/dataModels/IAddWordDataModel';
import { Gender } from '../../models/models/Enums/Gender.enum';
import { Language } from '../../models/models/Enums/Language.enum';
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

const mockDeWord: IAddWordDataModel = {
  word: 'Spiegel',
  gender: Gender.DER,
  topic: TopicType.FAMILY,
  translations: [{ translation: 'tükör' }],
};

const mockHuWord: IAddWordDataModel = {
  word: 'tükör',
  topic: TopicType.FAMILY,
  translations: [{ translation: 'Spiegel', gender: Gender.DER }],
};

const token: string =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsInJvbGVJZCI6MSwiaWF0IjoxNjI1ODU2Mzc5LCJleHAiOjE2MjU4NTk5Nzl9.q1O5nZgju0sO-ORTxiO745KkofE7nnFr0YsMML6Uuas';

describe('GET /', () => {
  test('succesfully retrieved german words', async () => {
    //Arrange
    wordService.getAllWords = jest.fn().mockResolvedValue(mockDeWords);
    jwtService.verifyToken = jest.fn().mockResolvedValue(true);

    //Act
    const response = await request(app)
      .get('/api/word/de')
      .set({ authorization: `Bearer ${token}` });

    //Assert
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({ wordList: mockDeWords });
    expect(wordService.getAllWords).toHaveBeenCalledTimes(1);
  });

  test('succesfully retrieved hungarian words', async () => {
    //Arrange
    wordService.getAllWords = jest.fn().mockResolvedValue(mockHunWords);
    jwtService.verifyToken = jest.fn().mockResolvedValue(true);

    //Act
    const response = await request(app)
      .get('/api/word/hu')
      .set({ authorization: `Bearer ${token}` });

    //Assert
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({ wordList: mockHunWords });
    expect(wordService.getAllWords).toHaveBeenCalledTimes(1);
  });

  test('invalid language', async () => {
    //Arrange
    console.error = jest.fn();

    //Act
    const response = await request(app)
      .get('/api/word/lol')
      .set({ authorization: `Bearer ${token}` });

    //Assert
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({
      message: 'Nincs ilyen nyelv a szótárban.',
    });
  });

  test('error in the service', async () => {
    //Arrange
    wordService.getAllWords = jest.fn().mockRejectedValue(serverError('test'));
    console.error = jest.fn();

    //Act
    const response = await request(app)
      .get('/api/word/de')
      .set({ authorization: `Bearer ${token}` });

    //Assert
    expect(response.statusCode).toEqual(500);
    expect(response.body).toEqual({ message: 'test' });
    expect(wordService.getAllWords).toHaveBeenCalledTimes(1);
  });
});

describe('DELETE /word', () => {
  const idRequest = '1';

  test('successfully delete german word', async () => {
    //Arrange
    wordService.removeWord = jest.fn().mockResolvedValue(idRequest);

    //Act
    const response = await request(app)
      .delete('/api/word/de/1')
      .set({ authorization: `Bearer ${token}` })
      .send(idRequest);

    //Assert
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      message: 'A szó sikeresen eltávolítva.',
    });
    expect(wordService.removeWord).toHaveBeenLastCalledWith(
      parseInt(idRequest),
      'de',
    );
  });

  test('successfully delete hungarian word', async () => {
    //Arrange
    wordService.removeWord = jest.fn().mockResolvedValue(idRequest);

    //Act
    const response = await request(app)
      .delete('/api/word/hu/1')
      .set({ authorization: `Bearer ${token}` })
      .send(idRequest);

    //Assert
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      message: 'A szó sikeresen eltávolítva.',
    });
    expect(wordService.removeWord).toHaveBeenLastCalledWith(
      parseInt(idRequest),
      'hu',
    );
  });

  test('invalid word id', async () => {
    //Act
    const response = await request(app)
      .delete('/api/word/hu/test')
      .set({ authorization: `Bearer ${token}` })
      .send(idRequest);

    //Assert
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({
      message: 'A szó id pozitív egész szám kell legyen.',
    });
  });

  test('error in the service', async () => {
    //Arrange
    wordService.removeWord = jest.fn().mockRejectedValue(serverError('error'));
    console.error = jest.fn();
    //Act
    const response = await request(app)
      .delete('/api/word/hu/1')
      .set({ authorization: `Bearer ${token}` })
      .send(idRequest);

    //Assert
    expect(response.statusCode).toEqual(500);
    expect(response.body).toEqual({ message: 'error' });
  });
});

describe('POST /ticket', () => {
  beforeEach(() => {
    jwtService.verifyToken = jest.fn().mockResolvedValue(true);
  });

  test('successfully adding german word', async () => {
    //Arrange
    wordService.addNewWord = jest.fn().mockResolvedValue(Promise.resolve);

    //Act
    const response = await request(app)
      .post('/api/word/de')
      .set({ authorization: `Bearer ${token}` })
      .send(mockDeWord);

    //Assert
    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual({
      message: 'Szó sikeresen hozzáadva.',
    });
    expect(wordService.addNewWord).toHaveBeenCalledWith(
      Language.DE,
      mockDeWord,
    );
  });

  test('successfully adding hungarian word', async () => {
    //Arrange
    wordService.addNewWord = jest.fn().mockResolvedValue(Promise.resolve);

    //Act
    const response = await request(app)
      .post('/api/word/hu')
      .set({ authorization: `Bearer ${token}` })
      .send(mockHuWord);

    //Assert
    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual({
      message: 'Szó sikeresen hozzáadva.',
    });
    expect(wordService.addNewWord).toHaveBeenCalledWith(
      Language.HU,
      mockHuWord,
    );
  });

  test('error in the service', async () => {
    //Arrange
    wordService.addNewWord = jest.fn().mockRejectedValue(serverError('test'));
    console.error = jest.fn();
    //Act
    const response = await request(app)
      .post('/api/word/de')
      .set({ authorization: `Bearer ${token}` })
      .send(mockDeWord);

    //Assert
    expect(response.statusCode).toEqual(500);
    expect(response.body).toEqual({ message: 'test' });
    expect(wordService.addNewWord).toHaveBeenCalledWith(
      Language.DE,
      mockDeWord,
    );
  });
});

describe('PUT /word', () => {
  test('successfully updating german word', async () => {
    //Arrange
    wordService.modifyWord = jest.fn().mockResolvedValue(Promise.resolve);

    //Act
    const response = await request(app)
      .put('/api/word//de/1')
      .set({ authorization: `Bearer ${token}` })
      .send(mockDeWord);

    //Assert
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      message: 'Szó sikeresen módosítva.',
    });
    expect(wordService.modifyWord).toHaveBeenCalledWith(
      Language.DE,
      mockDeWord,
      1,
    );
  });

  test('successfully updating hungarian word', async () => {
    //Arrange
    wordService.modifyWord = jest.fn().mockResolvedValue(Promise.resolve);

    //Act
    const response = await request(app)
      .put('/api/word//hu/1')
      .set({ authorization: `Bearer ${token}` })
      .send(mockHuWord);

    //Assert
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      message: 'Szó sikeresen módosítva.',
    });
    expect(wordService.modifyWord).toHaveBeenCalledWith(
      Language.HU,
      mockHuWord,
      1,
    );
  });

  test('should send back 400 error if params is not an integer', async () => {
    //Arrange
    wordService.modifyWord = jest.fn().mockResolvedValue(Promise.resolve);
    jest.spyOn(console, 'error').mockImplementation(() => {});

    //Act
    const response = await request(app)
      .put('/api/word/de/fail')
      .set({ authorization: `Bearer ${token}` })
      .send(mockDeWord);

    //Assert
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({
      message: 'A szó id pozitív egész szám kell legyen.',
    });
  });

  test('error in the service', async () => {
    //Arrange
    wordService.modifyWord = jest.fn().mockRejectedValue(serverError('test'));
    console.error = jest.fn();
    //Act
    const response = await request(app)
      .put('/api/word/de/1')
      .set({ authorization: `Bearer ${token}` })
      .send(mockDeWord);

    //Assert
    expect(response.statusCode).toEqual(500);
    expect(response.body).toEqual({ message: 'test' });
    expect(wordService.modifyWord).toHaveBeenCalledWith(
      Language.DE,
      mockDeWord,
      1,
    );
  });
});

describe('POST /filter', () => {
  test('succesfully retrieved filtered german words', async () => {
    //Arrange
    wordService.getFilteredWords = jest
      .fn()
      .mockResolvedValue({ wordList: mockHunWords, totalElements: 10 });
    jwtService.verifyToken = jest.fn().mockResolvedValue(true);

    //Act
    const response = await request(app)
      .post('/api/word/filter/de?pageNumber=1&pageSize=10')
      .set({ authorization: `Bearer ${token}` })
      .send({ topics: [1] });

    //Assert
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      wordList: mockHunWords,
      totalElements: 10,
    });
    expect(wordService.getFilteredWords).toHaveBeenCalledTimes(1);
  });

  test('succesfully retrieved filtered hungarian words', async () => {
    //Arrange
    wordService.getFilteredWords = jest
      .fn()
      .mockResolvedValue({ wordList: mockHunWords, totalElements: 10 });
    jwtService.verifyToken = jest.fn().mockResolvedValue(true);

    //Act
    const response = await request(app)
      .post('/api/word/filter/hu?pageNumber=1&pageSize=10')
      .set({ authorization: `Bearer ${token}` })
      .send({ topics: [1] });

    //Assert
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      wordList: mockHunWords,
      totalElements: 10,
    });
    expect(wordService.getFilteredWords).toHaveBeenCalledTimes(1);
  });

  test('invalid language', async () => {
    //Arrange
    console.error = jest.fn();

    //Act
    const response = await request(app)
      .post('/api/word/filter/test?pageNumber=1&pageSize=10')
      .set({ authorization: `Bearer ${token}` })
      .send({ topics: [1] });

    //Assert
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({
      message: 'Nincs ilyen nyelv a szótárban.',
    });
  });

  test('invalid pageNumber', async () => {
    //Arrange
    console.error = jest.fn();

    //Act
    const response = await request(app)
      .post('/api/word/filter/de?pageNumber=0&pageSize=10')
      .set({ authorization: `Bearer ${token}` })
      .send({ topics: [1] });

    //Assert
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({
      message: 'Érvénytelen oldalszám.',
    });
  });

  test('invalid pageSize', async () => {
    //Arrange
    console.error = jest.fn();

    //Act
    const response = await request(app)
      .post('/api/word/filter/de/?pageNumber=10&pageSize=test')
      .set({ authorization: `Bearer ${token}` })
      .send({ topics: [1] });

    //Assert
    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({
      message: 'Érvénytelen oldalhossz.',
    });
  });

  test('invalid topic', async () => {
    //Arrange
    console.error = jest.fn();

    //Act
    const response = await request(app)
      .post('/api/word/filter/de/?pageNumber=10&pageSize=test')
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
    wordService.getFilteredWords = jest
      .fn()
      .mockRejectedValue(serverError('test'));
    console.error = jest.fn();

    //Act
    const response = await request(app)
      .post('/api/word/filter/de/?pageNumber=10&pageSize=1')
      .set({ authorization: `Bearer ${token}` })
      .send({ topics: [1] });

    //Assert
    expect(response.statusCode).toEqual(500);
    expect(response.body).toEqual({ message: 'test' });
    expect(wordService.getFilteredWords).toHaveBeenCalledTimes(1);
  });
});
