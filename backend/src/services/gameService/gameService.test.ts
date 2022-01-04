import IGetWordsDataModel from '../../models/models/dataModels/IGetWordsDataModel';
import { Gender } from '../../models/models/Enums/Gender.enum';
import { Language } from '../../models/models/Enums/Language.enum';
import { wordRepository } from '../../repository/wordRepository/wordRepository';
import { serverError } from '../errorCreatorService/errorCreator.service';
import { gameService } from './gameService';

const mockDeWords: IGetWordsDataModel[] = [
  {
    id: 1,
    word: 'Wasser',
    gender: '' as Gender,
  },
];

const mockHunWords: IGetWordsDataModel[] = [
  {
    id: 1,
    word: 'víz',
  },
];

const mockQuantity: number = 10;

const mockLanguage: Language = Language.DE;

describe('getRandomWords', () => {
  test('successfully retrieved german words', async () => {
    //Arrange
    wordRepository.getRandomWords = jest.fn().mockResolvedValue(mockDeWords);

    //Act
    const words: IGetWordsDataModel[] = await gameService.getRandomWords(
      mockLanguage,
      mockQuantity,
    );

    //Assert
    expect(words).toStrictEqual([
      {
        id: 1,
        word: 'Wasser',
      },
    ]);
    expect(wordRepository.getRandomWords).toHaveBeenCalledTimes(1);
  });

  test('successfully retrieved hungarian words', async () => {
    //Arrange
    wordRepository.getRandomWords = jest.fn().mockResolvedValue(mockHunWords);

    //Act
    const words: IGetWordsDataModel[] = await gameService.getRandomWords(
      Language.HU,
      mockQuantity,
    );

    //Assert
    expect(words).toStrictEqual(mockHunWords);
    expect(wordRepository.getRandomWords).toHaveBeenCalledTimes(1);
  });

  test('repository error', async () => {
    //Arrange
    wordRepository.getRandomWords = jest
      .fn()
      .mockRejectedValue(serverError('test'));

    //Act
    try {
      await gameService.getRandomWords(mockLanguage, mockQuantity);
    } catch (err) {
      //Assert
      expect(err).toEqual(serverError('test'));
      expect(wordRepository.getRandomWords).toHaveBeenCalledTimes(1);
    }
  });
});
