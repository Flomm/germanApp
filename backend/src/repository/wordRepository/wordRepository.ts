import { db } from '../../data/connection';
import IAddTranslationDataModel from '../../models/models/dataModels/IAddTranslationDataModel';
import IAddWordDataModel from '../../models/models/dataModels/IAddWordDataModel';
import IDbResultDataModel from '../../models/models/dataModels/IDbResultDataModel';
import IGetWordsDataModel from '../../models/models/dataModels/IGetWordsDataModel';
import IGetWordsDomainModel from '../../models/models/domainModels/IWordDomainModel';
import { Language } from '../../models/models/Enums/Language.enum';
import {
  badRequestError,
  serverError,
} from '../../services/errorCreatorService/errorCreator.service';
import { generateMultipleInsertQueryQuestionMarks } from '../repository.helper';

export const wordRepository = {
  getAllWords(lang: Language): Promise<IGetWordsDataModel[]> {
    return db
      .query<IGetWordsDataModel[]>(
        `SELECT * FROM german_app.${lang} WHERE isDeleted = 0 ORDER BY word`,
        [],
      )
      .catch(err => Promise.reject(err));
  },

  getWordByWord(lang: Language, word: string): Promise<IGetWordsDomainModel> {
    return db
      .query<IGetWordsDomainModel[]>(
        `SELECT * FROM german_app.${lang} WHERE word = ?`,
        [word],
      )
      .then(res => res[0])
      .catch(err => Promise.reject(err));
  },

  addWord(
    lang: Language,
    newWord: IAddWordDataModel,
  ): Promise<IDbResultDataModel> {
    return db
      .query<IGetWordsDomainModel[]>(
        `SELECT * FROM german_app.${lang} WHERE word = ?`,
        [newWord.word],
      )
      .then(res => {
        if (res[0]) {
          const wordToRestore: IGetWordsDomainModel = res[0];
          if (wordToRestore.isDeleted) {
            return db
              .query<IDbResultDataModel>(
                `UPDATE german_app.${lang} SET isDeleted = 0 WHERE id = ?`,
                [`${wordToRestore.id}`],
              )
              .then(res => {
                if (res.affectedRows === 0) {
                  return Promise.reject(
                    serverError('Nem sikerült hozzáadni a szót.'),
                  );
                }
                return res;
              })
              .catch(err => Promise.reject(err));
          } else {
            return Promise.reject(
              badRequestError('A szó már szerepel az adatbázisban.'),
            );
          }
        }
        let queryString: string;
        let queryArray: string[];
        if (lang === Language.DE && newWord.gender) {
          queryString = `INSERT INTO german_app.${lang} (word, gender) VALUES (?, ?)`;
          queryArray = [newWord.word, newWord.gender];
        } else {
          queryString = `INSERT INTO german_app.${lang} (word) VALUES (?)`;
          queryArray = [newWord.word];
        }
        return db
          .query<IDbResultDataModel>(queryString, queryArray)
          .then(res => {
            if (res.affectedRows === 0) {
              return Promise.reject(
                serverError('Nem sikerült hozzáadni a szót.'),
              );
            }
            return res;
          })
          .catch(err => Promise.reject(err));
      })
      .catch(err => Promise.reject(err));
  },

  addTranslations(
    lang: Language,
    newWordId: number,
    translations: IAddTranslationDataModel[],
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

  addNewWordEntry(
    lang: Language,
    newWord: IAddWordDataModel,
  ): Promise<IDbResultDataModel> {
    return wordRepository
      .addWord(lang, newWord)
      .then(_ => {
        return wordRepository
          .getWordByWord(lang, newWord.word)
          .then(word => {
            return wordRepository
              .addTranslations(lang, word.id, newWord.translations)
              .catch(err => Promise.reject(err));
          })
          .catch(err => Promise.reject(err));
      })
      .catch(err => Promise.reject(err));
  },

  modifyWord(
    lang: Language,
    modifiedWord: IAddWordDataModel,
  ): Promise<IDbResultDataModel> {
    return db
      .query<IDbResultDataModel>('', [])
      .catch(err => Promise.reject(err));
  },

  removeWord(wordId: number, lang: Language): Promise<IDbResultDataModel> {
    return db
      .query<IDbResultDataModel>(
        `UPDATE german_app.${lang} SET isDeleted = 1 WHERE id = ?`,
        [`${wordId}`],
      )
      .then(_ => {
        return db
          .query<IDbResultDataModel>(
            `DELETE FROM german_app.translation WHERE wordId = ? AND lang = ?`,
            [`${wordId}`, lang],
          )
          .catch(err => Promise.reject(err));
      })
      .catch(err => Promise.reject(err));
  },
};
