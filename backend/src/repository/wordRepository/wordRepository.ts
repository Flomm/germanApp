import { db } from '../../data/connection';
import IAddWordDataModel from '../../models/models/dataModels/IAddWordDataModel';
import IDbResultDataModel from '../../models/models/dataModels/IDbResultDataModel';
import IGetWordsDataModel from '../../models/models/dataModels/IGetWordsDataModel';
import IGetWordsDomainModel from '../../models/models/domainModels/IWordDomainModel';
import { Language } from '../../models/models/Enums/Language.enum';
import {
  badRequestError,
  notFoundError,
  serverError,
} from '../../services/errorCreatorService/errorCreator.service';
import { translationRepository } from '../translationRepository/translationRepository';

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

  getWordById(lang: Language, wordId: number): Promise<IGetWordsDomainModel> {
    return db
      .query<IGetWordsDomainModel[]>(
        `SELECT * FROM german_app.${lang} WHERE id = ? AND isDeleted = 0`,
        [`${wordId}`],
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
            return translationRepository
              .addTranslations(lang, word.id, newWord.translations)
              .catch(err => Promise.reject(err));
          })
          .catch(err => Promise.reject(err));
      })
      .catch(err => Promise.reject(err));
  },

  removeWord(wordId: number, lang: Language): Promise<IDbResultDataModel> {
    return db
      .query<IDbResultDataModel>(
        `UPDATE german_app.${lang} SET isDeleted = 1 WHERE id = ?`,
        [`${wordId}`],
      )
      .then(_ => {
        return translationRepository
          .removeTranslations(wordId, lang)
          .catch(err => Promise.reject(err));
      })
      .catch(err => Promise.reject(err));
  },

  modifyWord(
    lang: Language,
    modifiedWord: IAddWordDataModel,
    wordId: number,
  ): Promise<IDbResultDataModel> {
    return db
      .query<IDbResultDataModel>(
        `UPDATE german_app.${lang} SET word = ?, gender = ?  WHERE id = ?`,
        [modifiedWord.word, modifiedWord.gender!, `${wordId}`],
      )
      .catch(err => Promise.reject(err));
  },

  modifyWordEntry(
    lang: Language,
    modifiedWord: IAddWordDataModel,
    wordId: number,
  ): Promise<IDbResultDataModel> {
    return wordRepository
      .getWordById(lang, wordId)
      .then(res => {
        if (res) {
          return wordRepository
            .modifyWord(lang, modifiedWord, wordId)
            .then(res => {
              if (res.affectedRows < 0) {
                return Promise.reject(
                  serverError('A módosítás sikertelen volt.'),
                );
              } else {
                return translationRepository
                  .removeTranslations(wordId, lang)
                  .then(_ => {
                    return translationRepository
                      .addTranslations(lang, wordId, modifiedWord.translations)
                      .catch(err => Promise.reject(err));
                  })
                  .catch(err => Promise.reject(err));
              }
            })
            .catch(err => Promise.reject(err));
        } else {
          return Promise.reject(
            notFoundError('A szó nem szerepel az adatbázisban.'),
          );
        }
      })
      .catch(err => Promise.reject(err));
  },
};
