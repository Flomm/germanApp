import IAddWordDataModel from '../../models/models/dataModels/IAddWordDataModel';
import IDbResultDataModel from '../../models/models/dataModels/IDbResultDataModel';
import IGetWordsDataModel from '../../models/models/dataModels/IGetWordsDataModel';
import { Gender } from '../../models/models/Enums/Gender.enum';
import { Language } from '../../models/models/Enums/Language.enum';
import { TopicType } from '../../models/models/Enums/TopicType.enum';
import IGetWordsResponse from '../../models/responses/IGetWordsResponse';
import { wordRepository } from '../../repository/wordRepository/wordRepository';
import {
  notFoundError,
  serverError,
} from '../errorCreatorService/errorCreatorService';
import { translationService } from '../translationService/translationService';
import { wordService } from './wordService';

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

const mockLanguage: Language = Language.DE;

describe('getAllWords', () => {
  test('successfully retrieved german words', async () => {
    //Arrange
    wordRepository.getAllWords = jest.fn().mockResolvedValue(mockDeWords);

    //Act
    const words: IGetWordsDataModel[] = await wordService.getAllWords(
      mockLanguage,
    );

    //Assert
    expect(words).toStrictEqual(mockDeWords);
    expect(wordRepository.getAllWords).toHaveBeenCalledTimes(1);
  });

  test('successfully retrieved hungarian words', async () => {
    //Arrange
    wordRepository.getAllWords = jest.fn().mockResolvedValue(mockHunWords);

    //Act
    const words: IGetWordsDataModel[] = await wordService.getAllWords(
      mockLanguage,
    );

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
    expect(wordRepository.removeWord).toHaveBeenCalledWith(
      idRequest,
      mockLanguage,
    );
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
      expect(wordRepository.removeWord).toHaveBeenCalledWith(
        idRequest,
        mockLanguage,
      );
      expect(err).toEqual(notFoundError('A szó id nem található.'));
    }
  });

  test('repository error', async () => {
    //Arrange
    wordRepository.removeWord = jest
      .fn()
      .mockRejectedValue(serverError('test'));

    //Act
    try {
      await wordService.removeWord(idRequest, mockLanguage);
    } catch (err) {
      //Assert
      expect(err).toEqual(serverError('test'));
      expect(wordRepository.getAllWords).toHaveBeenCalledTimes(1);
    }
  });
});

describe('addNewWord', () => {
  test('successfully adding german word', async () => {
    //Arrange
    const mockDbResult: IDbResultDataModel = {
      affectedRows: 1,
    };
    wordRepository.addNewWordEntry = jest.fn().mockResolvedValue(mockDbResult);

    //Act
    await wordService.addNewWord(mockLanguage, mockDeWord);

    //Assert
    expect(wordRepository.addNewWordEntry).toHaveBeenCalledWith(
      Language.DE,
      mockDeWord,
    );
  });

  test('successfully adding hungarian word', async () => {
    //Arrange
    const mockDbResult: IDbResultDataModel = {
      affectedRows: 1,
    };
    wordRepository.addNewWordEntry = jest.fn().mockResolvedValue(mockDbResult);

    //Act
    await wordService.addNewWord(Language.HU, mockDeWord);

    //Assert
    expect(wordRepository.addNewWordEntry).toHaveBeenCalledWith(
      Language.HU,
      mockDeWord,
    );
  });

  test('should create servererror if affectedrows is 0', async () => {
    //Arrange
    const mockDbResult: IDbResultDataModel = {
      affectedRows: 0,
    };
    wordRepository.addNewWordEntry = jest.fn().mockResolvedValue(mockDbResult);

    //Act
    try {
      await wordService.addNewWord(mockLanguage, mockDeWord);
    } catch (err) {
      //Assert
      expect(err).toEqual(notFoundError('A hozzáadás nem sikerült.'));
      expect(wordRepository.addNewWordEntry).toHaveBeenCalledWith(
        Language.DE,
        mockDeWord,
      );
    }
  });

  test('repository error', async () => {
    //Arrange
    wordRepository.addNewWordEntry = jest
      .fn()
      .mockRejectedValue(serverError('test'));

    //Act
    try {
      await wordService.addNewWord(mockLanguage, mockDeWord);
    } catch (err) {
      //Assert
      expect(err).toEqual(serverError('test'));
      expect(wordRepository.addNewWordEntry).toHaveBeenCalledWith(
        Language.DE,
        mockDeWord,
      );
    }
  });
});

describe('modifyWord', () => {
  test('successfully updating word', async () => {
    //Arrange
    const mockDbResult: IDbResultDataModel = {
      affectedRows: 1,
    };
    wordRepository.modifyWordEntry = jest.fn().mockResolvedValue(mockDbResult);

    //Act
    await wordService.modifyWord(Language.DE, mockDeWord, 1);
    //Assert

    expect(wordRepository.modifyWordEntry).toHaveBeenCalledWith(
      Language.DE,
      mockDeWord,
      1,
    );
  });
  test('should create servererror if affectedrows is 0', async () => {
    //Arrange
    const mockDbResult: IDbResultDataModel = {
      affectedRows: 0,
    };

    wordRepository.modifyWordEntry = jest.fn().mockResolvedValue(mockDbResult);

    //Act
    try {
      await wordService.modifyWord(Language.DE, mockDeWord, 1);
    } catch (err) {
      //Assert
      expect(err).toEqual(notFoundError('A módosítás nem sikerült.'));
      expect(wordRepository.modifyWordEntry).toHaveBeenCalledWith(
        Language.DE,
        mockDeWord,
        1,
      );
    }
  });

  test('repository error', async () => {
    //Arrange
    wordRepository.modifyWordEntry = jest
      .fn()
      .mockRejectedValue(serverError('test'));

    //Act
    try {
      await wordService.modifyWord(Language.DE, mockDeWord, 1);
    } catch (err) {
      //Assert
      expect(err).toEqual(serverError('test'));
      expect(wordRepository.modifyWordEntry).toHaveBeenCalledWith(
        Language.DE,
        mockDeWord,
        1,
      );
    }
  });
});

describe('getFilteredWords', () => {
  test('successfully retrieved german words', async () => {
    //Arrange
    wordRepository.getFilteredWords = jest.fn().mockResolvedValue(mockDeWords);
    wordRepository.getTotalElementsForFilter = jest
      .fn()
      .mockResolvedValue({ 'COUNT(*)': 10 });
    translationService.getTranslationsByWordId = jest
      .fn()
      .mockResolvedValue([{ translation: 'test' }]);

    //Act
    const filterResponse: IGetWordsResponse =
      await wordService.getFilteredWords({
        language: mockLanguage,
        pageSize: 10,
        pageNumber: 1,
      });

    //Assert
    expect(filterResponse).toStrictEqual({
      totalElements: 10,
      wordList: [
        { ...mockDeWords[0], translations: [{ translation: 'test' }] },
      ],
    });
    expect(wordRepository.getFilteredWords).toHaveBeenCalledTimes(1);
    expect(wordRepository.getTotalElementsForFilter).toHaveBeenCalledTimes(1);
    expect(translationService.getTranslationsByWordId).toHaveBeenCalledTimes(
      mockDeWords.length,
    );
  });

  test('successfully retrieved hungarian words', async () => {
    //Arrange
    wordRepository.getFilteredWords = jest.fn().mockResolvedValue(mockHunWords);
    wordRepository.getTotalElementsForFilter = jest
      .fn()
      .mockResolvedValue({ 'COUNT(*)': 10 });
    translationService.getTranslationsByWordId = jest
      .fn()
      .mockResolvedValue([{ translation: 'test' }]);

    //Act
    const filterResponse: IGetWordsResponse =
      await wordService.getFilteredWords({
        language: Language.HU,
        pageSize: 10,
        pageNumber: 1,
      });

    //Assert
    expect(filterResponse).toStrictEqual({
      totalElements: 10,
      wordList: [
        {
          ...mockHunWords[0],
          translations: [{ translation: 'test' }],
        },
      ],
    });
    expect(wordRepository.getFilteredWords).toHaveBeenCalledTimes(1);
    expect(wordRepository.getTotalElementsForFilter).toHaveBeenCalledTimes(1);
    expect(translationService.getTranslationsByWordId).toHaveBeenCalledTimes(
      mockHunWords.length,
    );
  });

  test('repository error', async () => {
    //Arrange
    wordRepository.getFilteredWords = jest
      .fn()
      .mockRejectedValue(serverError('test'));

    //Act
    try {
      await wordRepository.getFilteredWords({
        language: Language.HU,
        pageSize: 10,
        pageNumber: 1,
      });
    } catch (err) {
      //Assert
      expect(err).toEqual(serverError('test'));
      expect(wordRepository.getFilteredWords).toHaveBeenCalledTimes(1);
    }
  });
});
