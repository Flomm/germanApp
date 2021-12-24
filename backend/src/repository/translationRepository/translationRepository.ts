import { db } from '../../data/connection';
import ITranslationDataModel from '../../models/models/dataModels/ITranslationDataModel';
import IDbResultDataModel from '../../models/models/dataModels/IDbResultDataModel';
import { Language } from '../../models/models/Enums/Language.enum';
import { generateMultipleInsertQueryQuestionMarks } from '../repository.helper';

export const translationRepository = {
  addTranslations(
    lang: Language,
    newWordId: number,
    translations: ITranslationDataModel[],
  ): Promise<IDbResultDataModel> {
    return db
      .query<IDbResultDataModel>(
        `INSERT INTO german_app.translation (lang, wordId, translation, gender) VALUES ${generateMultipleInsertQueryQuestionMarks(
          4,
          translations.length,
        )}`,
        translations
          .map(trans => [
            `${lang}`,
            `${newWordId}`,
            `${trans.translation}`,
            trans.gender!,
          ])
          .reduce((acc, val) => acc.concat(val), []),
      )
      .catch(err => Promise.reject(err));
  },

  removeTranslations(
    wordId: number,
    lang: Language,
  ): Promise<IDbResultDataModel> {
    return db
      .query<IDbResultDataModel>(
        `DELETE FROM german_app.translation WHERE wordId = ? AND lang = ?`,
        [`${wordId}`, lang],
      )
      .catch(err => Promise.reject(err));
  },
};
