import IAddWordDataModel from '../../models/models/dataModels/IAddWordDataModel';
import IGetWordsDataModel from '../../models/models/dataModels/IGetWordsDataModel';
import ITranslationDataModel from '../../models/models/dataModels/ITranslationDataModel';
import { Language } from '../../models/models/Enums/Language.enum';
import { TopicType } from '../../models/models/Enums/TopicType.enum';
import { translationRepository } from '../../repository/translationRepository/translationRepository';
import { wordRepository } from '../../repository/wordRepository/wordRepository';
import { notFoundError } from '../errorCreatorService/errorCreator.service';

export const wordService = {
  getAllWords(lang: Language): Promise<IGetWordsDataModel[]> {
    return wordRepository.getAllWords(lang).catch(err => Promise.reject(err));
  },

  async getFilteredWords(
    lang: Language,
    pageNumber: number,
    pageSize: number,
    topics: TopicType[],
  ): Promise<IGetWordsDataModel[]> {
    try {
      const filteredWords: IGetWordsDataModel[] =
        await wordRepository.getFilteredWords(
          lang,
          pageNumber,
          pageSize,
          topics,
        );
      const filteredWithTranslations: IGetWordsDataModel[] = await Promise.all(
        filteredWords.map(async word => {
          let translations: ITranslationDataModel[] =
            await translationRepository.getTranslationsByWordId(lang, word.id);
          translations = translations.map(translationObject => {
            if (!translationObject.gender) {
              return { translation: translationObject.translation };
            }
            return translationObject;
          });
          return { ...word, translations };
        }),
      );
      return filteredWithTranslations;
    } catch (err) {
      return Promise.reject(err);
    }
  },

  addNewWord(lang: Language, newWord: IAddWordDataModel): Promise<void> {
    return wordRepository
      .addNewWordEntry(lang, newWord)
      .then(dbResult => {
        if (dbResult.affectedRows === 0) {
          return Promise.reject(notFoundError('A hozzáadás nem sikerült.'));
        }
      })
      .catch(err => Promise.reject(err));
  },

  modifyWord(
    lang: Language,
    modifyWord: IAddWordDataModel,
    wordId: number,
  ): Promise<void> {
    return wordRepository
      .modifyWordEntry(lang, modifyWord, wordId)
      .then(dbResult => {
        if (dbResult?.affectedRows === 0) {
          return Promise.reject(notFoundError('A módosítás nem sikerült.'));
        }
      })
      .catch(err => Promise.reject(err));
  },

  removeWord(wordId: number, lang: Language): Promise<void> {
    return wordRepository
      .removeWord(wordId, lang)
      .then(dbResult => {
        if (dbResult.affectedRows < 1) {
          return Promise.reject(notFoundError('A szó id nem található.'));
        }
      })
      .catch(err => Promise.reject(err));
  },
};
