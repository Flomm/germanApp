import IGetWordsDataModel from "../../models/models/dataModels/IGetWordsDataModel";
import { Language } from "../../models/models/Enums/Language.enum";
import { wordRepository } from "../../repository/wordRepository/wordRepository";
import { serverError } from "../errorCreatorService/errorCreator.service";
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
  

describe('getAllWords', () => {
    test('successfully retrieved german words', async () => {
      //Arrange
      wordRepository.getAllWords = jest.fn().mockResolvedValue(mockDeWords);
  
      //Act
      const words: IGetWordsDataModel[] = await wordService.getAllWords(Language.DE);
  
      //Assert
      expect(words).toStrictEqual(mockDeWords);
      expect(wordRepository.getAllWords).toHaveBeenCalledTimes(1);
    });

    test('successfully retrieved hungarian words', async () => {
        //Arrange
        wordRepository.getAllWords = jest.fn().mockResolvedValue(mockHunWords);
    
        //Act
        const words: IGetWordsDataModel[] = await wordService.getAllWords(Language.DE);
    
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