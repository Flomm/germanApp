import IGetWordsDataModel from '../../models/models/dataModels/IGetWordsDataModel';
import ITranslationDataModel from '../../models/models/dataModels/ITranslationDataModel';
import { Gender } from '../../models/models/Enums/Gender.enum';
import { Language } from '../../models/models/Enums/Language.enum';
import { TopicType } from '../../models/models/Enums/TopicType.enum';
import ICheckAnswerRequest from '../../models/requests/ICheckAnswerRequest';
import ICheckAnswerResponse from '../../models/responses/ICheckAnswerResponse';
import { translationRepository } from '../../repository/translationRepository/translationRepository';
import { wordRepository } from '../../repository/wordRepository/wordRepository';
import { serverError } from '../errorCreatorService/errorCreator.service';
import { gameService } from './gameService';

const mockDeWords: IGetWordsDataModel[] = [
  {
    id: 1,
    word: 'Wasser',
    gender: '' as Gender,
    numOfTranslations: 1,
    topic: TopicType.FAMILY,
  },
];

const mockHunWords: IGetWordsDataModel[] = [
  {
    id: 1,
    word: 'víz',
    numOfTranslations: 1,
    topic: TopicType.FAMILY,
  },
];

const mockQuantity: number = 10;

const mockLanguage: Language = Language.DE;

const mockCheckAnswerRequest: ICheckAnswerRequest = {
  wordId: 1,
  answerList: [{ answer: 'test', gender: Gender.DER }],
};

const mockCheckAnswerRequestNew: ICheckAnswerRequest = {
  wordId: 1,
  answerList: [{ answer: 'test', gender: Gender.DAS }],
};

const mockTranslationListForNullsTest: ITranslationDataModel[] = [
  { translation: 'test', gender: Gender.DER },
  { translation: 'test2', gender: '' as Gender },
];

const mockCleanedTranslationListForNullsTest: ITranslationDataModel[] = [
  { translation: 'test', gender: Gender.DER },
  { translation: 'test2' },
];

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
        topic: TopicType.FAMILY,
        numOfTranslations: 1,
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

describe('checkAnswer', () => {
  test('successfully checked correct answer', async () => {
    //Arrange
    translationRepository.getTranslationsByWordId = jest
      .fn()
      .mockResolvedValue(mockTranslationListForNullsTest);

    //Act
    const checkAnswer: ICheckAnswerResponse = await gameService.checkAnswer(
      mockLanguage,
      mockCheckAnswerRequest,
    );

    //Assert
    expect(checkAnswer).toStrictEqual({
      isCorrect: true,
      translations: mockCleanedTranslationListForNullsTest,
    });
    expect(wordRepository.getRandomWords).toHaveBeenCalledTimes(1);
  });

  test('successfully checked incorrect answer', async () => {
    //Arrange
    translationRepository.getTranslationsByWordId = jest
      .fn()
      .mockResolvedValue(mockTranslationListForNullsTest);

    //Act
    const checkAnswer: ICheckAnswerResponse = await gameService.checkAnswer(
      mockLanguage,
      mockCheckAnswerRequestNew,
    );

    //Assert
    expect(checkAnswer).toStrictEqual({
      isCorrect: false,
      translations: mockCleanedTranslationListForNullsTest,
    });
    expect(wordRepository.getRandomWords).toHaveBeenCalledTimes(1);
  });

  test('repository error', async () => {
    //Arrange
    translationRepository.getTranslationsByWordId = jest
      .fn()
      .mockRejectedValue(serverError('test'));

    //Act
    try {
      await gameService.checkAnswer(mockLanguage, mockCheckAnswerRequest);
    } catch (err) {
      //Assert
      expect(err).toEqual(serverError('test'));
      expect(
        translationRepository.getTranslationsByWordId,
      ).toHaveBeenCalledTimes(1);
    }
  });
});
