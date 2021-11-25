import IDbResultDataModel from "../../models/models/dataModels/IDbResultDataModel";
import IGetWordsDataModel from "../../models/models/dataModels/IGetWordsDataModel";
import { Language } from "../../models/models/Enums/Language.enum";
import { wordRepository } from "../../repository/wordRepository/wordRepository";
import { notFoundError, serverError } from "../errorCreatorService/errorCreator.service";
import { wordService } from "./wordService";

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
  
  const mockLanguage: Language = Language.DE

describe('getAllWords', () => {
    test('successfully retrieved german words', async () => {
      //Arrange
      wordRepository.getAllWords = jest.fn().mockResolvedValue(mockDeWords);
  
      //Act
      const words: IGetWordsDataModel[] = await wordService.getAllWords(mockLanguage);
  
      //Assert
      expect(words).toStrictEqual(mockDeWords);
      expect(wordRepository.getAllWords).toHaveBeenCalledTimes(1);
    });

    test('successfully retrieved hungarian words', async () => {
        //Arrange
        wordRepository.getAllWords = jest.fn().mockResolvedValue(mockHunWords);
    
        //Act
        const words: IGetWordsDataModel[] = await wordService.getAllWords(mockLanguage);
    
        //Assert
        expect(words).toStrictEqual(mockHunWords);
        expect(wordRepository.getAllWords).toHaveBeenCalledTimes(1);
      });



    test('repository error', async () => {
      //Arrange
      wordRepository.getAllWords = jest
        .fn()
        .mockRejectedValue(serverError('test'));
  
      //Act
      try {
        await wordService.getAllWords(Language.DE);
      } catch (err) {
        //Assert
        expect(err).toEqual(serverError('test'));
        expect(wordRepository.getAllWords).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('removeWord', () => {
    const idRequest = 1;

    test('successfully remove word', async () => {
      wordRepository.removeWord = jest.fn().mockResolvedValue(idRequest);
  
      //Act
      await wordService.removeWord(idRequest, mockLanguage);
  
      //Assert
      expect(wordRepository.removeWord).toHaveBeenCalledWith(idRequest, mockLanguage);
    });
  
    test('WordId not found', async () => {
      //Arrange
      const mockDbResult: IDbResultDataModel = {
        affectedRows: 0,
      };
      wordRepository.removeWord = jest.fn().mockResolvedValue(mockDbResult);
  
      //Act
      try {
        await wordService.removeWord(idRequest, mockLanguage);
      } catch (err) {
        //Assert
        expect(wordRepository.removeWord).toHaveBeenCalledWith(idRequest, mockLanguage);
        expect(err).toEqual(notFoundError('A szó id nem található.'));
      }
    })

    test('repository error', async () => {
      //Arrange
      wordRepository.removeWord = jest
        .fn()
        .mockRejectedValue(serverError('test'));
  
      //Act
      try {
        await wordService.removeWord(idRequest, Language.DE);
      } catch (err) {
        //Assert
        expect(err).toEqual(serverError('test'));
        expect(wordRepository.getAllWords).toHaveBeenCalledTimes(1);
      }
    });
  })