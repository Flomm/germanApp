import ITranslationDataModel from '../../models/models/dataModels/ITranslationDataModel';
import { Gender } from '../../models/models/Enums/Gender.enum';
import { Language } from '../../models/models/Enums/Language.enum';
import { translationRepository } from '../../repository/translationRepository/translationRepository';
import { serverError } from '../errorCreatorService/errorCreatorService';
import { translationService } from './translationService';

const mockTranslationList: ITranslationDataModel[] = [
  { translation: 'test', gender: Gender.DER },
  { translation: 'test2' },
];

const mockTranslationListForNullsTest: ITranslationDataModel[] = [
  { translation: 'test', gender: Gender.DER },
  { translation: 'test2', gender: '' as Gender },
];

const mockCleanedTranslationListForNullsTest: ITranslationDataModel[] = [
  { translation: 'test', gender: Gender.DER },
  { translation: 'test2' },
];

const mockId: number = 1;

describe('getTranslationsByWordId', () => {
  test('successfully retrieved translations for german word', async () => {
    //Arrange
    translationRepository.getTranslationsByWordId = jest
      .fn()
      .mockResolvedValue(mockTranslationList);

    //Act
    const translations: ITranslationDataModel[] =
      await translationService.getTranslationsByWordId(Language.DE, mockId);

    //Assert
    expect(translations).toStrictEqual(mockTranslationList);
    expect(translationRepository.getTranslationsByWordId).toHaveBeenCalledTimes(
      1,
    );
  });

  test('successfully retrieved translations for hungarian word', async () => {
    //Arrange
    translationRepository.getTranslationsByWordId = jest
      .fn()
      .mockResolvedValue(mockTranslationList);

    //Act
    const translations: ITranslationDataModel[] =
      await translationService.getTranslationsByWordId(Language.HU, mockId);

    //Assert
    expect(translations).toStrictEqual(mockTranslationList);
    expect(translationRepository.getTranslationsByWordId).toHaveBeenCalledTimes(
      1,
    );
  });

  test('successfully cleaned translations from null genders', async () => {
    //Arrange
    translationRepository.getTranslationsByWordId = jest
      .fn()
      .mockResolvedValue(mockTranslationListForNullsTest);

    //Act
    const translations: ITranslationDataModel[] =
      await translationService.getTranslationsByWordId(Language.HU, mockId);

    //Assert
    expect(translations).toStrictEqual(mockCleanedTranslationListForNullsTest);
    expect(translationRepository.getTranslationsByWordId).toHaveBeenCalledTimes(
      1,
    );
  });

  test('repository error', async () => {
    //Arrange
    translationRepository.getTranslationsByWordId = jest
      .fn()
      .mockRejectedValue(serverError('test'));

    //Act
    try {
      await translationService.getTranslationsByWordId(Language.DE, mockId);
    } catch (err) {
      //Assert
      expect(err).toEqual(serverError('test'));
      expect(
        translationRepository.getTranslationsByWordId,
      ).toHaveBeenCalledTimes(1);
    }
  });
});
