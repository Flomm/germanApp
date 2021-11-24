import app from '../../app';
import request from 'supertest';
import { jwtService } from '../../services/jwtService/jwt.service';
import { wordService } from '../../services/wordService/wordService';
import IGetWordsDataModel from '../../models/models/dataModels/IGetWordsDataModel';
import { serverError } from '../../services/errorCreatorService/errorCreator.service';

const mockDeWords: IGetWordsDataModel[] = [
  {
    id: 1,
    word: 'Wasser'
  },
];

const mockHunWords: IGetWordsDataModel[] = [
    {
      id: 1,
      word: 'víz'
    },
  ];

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
  