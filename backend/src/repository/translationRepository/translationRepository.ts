import { db } from '../../data/connection';
import config from '../../config';
import ITranslationDataModel from '../../models/models/dataModels/ITranslationDataModel';
import IDbResultDataModel from '../../models/models/dataModels/IDbResultDataModel';
import { Language } from '../../models/models/Enums/Language.enum';
import { generateMultipleInsertQueryQuestionMarks } from '../helpers/multipleInsertion/multipleInsertion.helper';

export const translationRepository = {
  getTranslationsByWordId(
    lang: Language,
    wordId: number,
  ): Promise<ITranslationDataModel[]> {
    return db
      .query<ITranslationDataModel[]>(
        `SELECT translation, gender FROM ${config.mysql.database}.translation WHERE lang = ? AND wordId = ?`,
        [lang, `${wordId}`],
      )
      .catch(err => Promise.reject(err));
  },

  addTranslations(
    lang: Language,
    newWordId: number,
    translations: ITranslationDataModel[],
  ): Promise<IDbResultDataModel> {
    return db
      .query<IDbResultDataModel>(
        `INSERT INTO ${
          config.mysql.database
        }.translation (lang, wordId, translation, gender) VALUES ${generateMultipleInsertQueryQuestionMarks(
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
        `DELETE FROM ${config.mysql.database}.translation WHERE wordId = ? AND lang = ?`,
        [`${wordId}`, lang],
      )
      .catch(err => Promise.reject(err));
  },
};
