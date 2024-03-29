import config from '../../config';
import { db } from '../../data/connection';
import IAddWordDataModel from '../../models/models/dataModels/IAddWordDataModel';
import IDBCountResultDataModel from '../../models/models/dataModels/IDBCountResultDataModel';
import IDbResultDataModel from '../../models/models/dataModels/IDbResultDataModel';
import IFilterFormDataModel from '../../models/models/dataModels/IFilterFormDataModel';
import IGetWordsDataModel from '../../models/models/dataModels/IGetWordsDataModel';
import IGetWordsDomainModel from '../../models/models/domainModels/IWordDomainModel';
import { Language } from '../../models/models/Enums/Language.enum';
import { TopicType } from '../../models/models/Enums/TopicType.enum';
import {
  badRequestError,
  notFoundError,
  notSatisfiableError,
  serverError,
} from '../../services/errorCreatorService/errorCreatorService';
import { translationRepository } from '../translationRepository/translationRepository';

export const wordRepository = {
  getAllWords(lang: Language): Promise<IGetWordsDataModel[]> {
    return db
      .query<IGetWordsDataModel[]>(
        `SELECT * FROM ${config.mysql.database}.?? WHERE isDeleted = 0 ORDER BY word`,
        [`${lang}`],
      )
      .catch(err => Promise.reject(err));
  },

  getWordByWord(lang: Language, word: string): Promise<IGetWordsDomainModel> {
    return db
      .query<IGetWordsDomainModel[]>(
        `SELECT * FROM ${config.mysql.database}.?? WHERE word = ?`,
        [`${lang}`, word],
      )
      .then(res => res[0])
      .catch(err => Promise.reject(err));
  },

  getWordById(lang: Language, wordId: number): Promise<IGetWordsDomainModel> {
    return db
      .query<IGetWordsDomainModel[]>(
        `SELECT * FROM ${config.mysql.database}.?? WHERE id = ? AND isDeleted = 0`,
        [`${lang}`, `${wordId}`],
      )
      .then(res => res[0])
      .catch(err => Promise.reject(err));
  },

  async addWord(
    lang: Language,
    newWord: IAddWordDataModel,
  ): Promise<IDbResultDataModel> {
    try {
      let queryString = `UPDATE ${config.mysql.database}.?? SET isDeleted = 0 WHERE id = ?`;
      const existingWord: IGetWordsDomainModel =
        await wordRepository.getWordByWord(lang, newWord.word);
      if (existingWord) {
        if (existingWord.isDeleted) {
          const dbResult: IDbResultDataModel =
            await db.query<IDbResultDataModel>(queryString, [
              `${lang}`,
              `${existingWord.id}`,
            ]);
          if (dbResult.affectedRows === 0) {
            throw serverError('Nem sikerült hozzáadni a szót.');
          }
          return Promise.resolve(dbResult);
        } else {
          throw badRequestError('A szó már szerepel az adatbázisban.');
        }
      } else {
        const queryArray: string[] = [
          `${lang}`,
          newWord.word,
          `${newWord.translations.length}`,
          `${newWord.topic}`,
        ];
        if (lang === Language.DE && newWord.gender) {
          queryString = `INSERT INTO ${config.mysql.database}.?? (word, numOfTranslations, topic, gender) VALUES (?, ?, ?, ?)`;
          queryArray.push(newWord.gender);
        } else {
          queryString = `INSERT INTO ${config.mysql.database}.?? (word, numOfTranslations, topic) VALUES (?, ?, ?)`;
        }
        const dbResult: IDbResultDataModel = await db.query<IDbResultDataModel>(
          queryString,
          queryArray,
        );
        if (dbResult.affectedRows === 0) {
          throw serverError('Nem sikerült hozzáadni a szót.');
        }
        return Promise.resolve(dbResult);
      }
    } catch (err) {
      return Promise.reject(err);
    }
  },

  async addNewWordEntry(
    lang: Language,
    newWord: IAddWordDataModel,
  ): Promise<IDbResultDataModel> {
    try {
      await wordRepository.addWord(lang, newWord);
      const addedWord: IGetWordsDomainModel =
        await wordRepository.getWordByWord(lang, newWord.word);
      return Promise.resolve(
        translationRepository.addTranslations(
          lang,
          addedWord.id,
          newWord.translations,
        ),
      );
    } catch (err) {
      return Promise.reject(err);
    }
  },

  async removeWord(
    wordId: number,
    lang: Language,
  ): Promise<IDbResultDataModel> {
    try {
      await db.query<IDbResultDataModel>(
        `UPDATE ${config.mysql.database}.?? SET isDeleted = 1 WHERE id = ?`,
        [`${lang}`, `${wordId}`],
      );
      return Promise.resolve(
        translationRepository.removeTranslations(wordId, lang),
      );
    } catch (err) {
      return Promise.reject(err);
    }
  },

  modifyWord(
    lang: Language,
    modifiedWord: IAddWordDataModel,
    wordId: number,
  ): Promise<IDbResultDataModel> {
    let queryString = `UPDATE ${config.mysql.database}.?? SET word = ?, numOfTranslations = ?, topic = ? WHERE id = ?`;
    const queryArray: string[] = [
      `${lang}`,
      modifiedWord.word,
      `${modifiedWord.translations.length}`,
      `${modifiedWord.topic}`,
      `${wordId}`,
    ];
    if (lang === Language.DE) {
      queryArray.splice(
        queryArray.indexOf(modifiedWord.word),
        0,
        modifiedWord.gender!,
      );
      queryString = `UPDATE ${config.mysql.database}.?? SET gender = ?, word = ?, numOfTranslations = ?, topic = ? WHERE id = ?`;
    }
    return db
      .query<IDbResultDataModel>(queryString, queryArray)
      .catch(err => Promise.reject(err));
  },

  async modifyWordEntry(
    lang: Language,
    modifiedWord: IAddWordDataModel,
    wordId: number,
  ): Promise<IDbResultDataModel> {
    try {
      const word: IGetWordsDomainModel = await wordRepository.getWordById(
        lang,
        wordId,
      );
      if (word) {
        const dbResult: IDbResultDataModel = await wordRepository.modifyWord(
          lang,
          modifiedWord,
          wordId,
        );
        if (dbResult.affectedRows < 0) {
          throw serverError('A módosítás sikertelen volt.');
        } else {
          await translationRepository.removeTranslations(wordId, lang);
          return Promise.resolve(
            await translationRepository.addTranslations(
              lang,
              wordId,
              modifiedWord.translations,
            ),
          );
        }
      } else {
        throw notFoundError('A szó nem szerepel az adatbázisban.');
      }
    } catch (err) {
      return Promise.reject(err);
    }
  },

  async getFilteredWords(
    filterData: IFilterFormDataModel,
  ): Promise<IGetWordsDataModel[]> {
    try {
      const offSet: number = (filterData.pageNumber - 1) * filterData.pageSize;
      let queryString = `SELECT id, word${
        filterData.language === Language.DE ? ', gender ' : ''
      }, topic FROM ${
        config.mysql.database
      }.?? WHERE isDeleted = 0 ORDER BY word LIMIT ?, ?;`;
      const queryArray: (string | number)[] = [`${filterData.language}`];

      if (filterData.topics?.length && filterData.topics.length > 0) {
        let topicAndSearchQuery = ' AND';
        filterData.topics!.forEach((topic, i) => {
          i === filterData.topics!.length - 1
            ? (topicAndSearchQuery = `${topicAndSearchQuery} (topic = ?) `)
            : (topicAndSearchQuery = `${topicAndSearchQuery} (topic = ?) OR`);
          queryArray.push(topic);
        });

        if (filterData.searchString) {
          topicAndSearchQuery =
            topicAndSearchQuery = `${topicAndSearchQuery} AND (word LIKE CONCAT("%", ? , "%")) `;
          queryArray.push(filterData.searchString);
        }

        queryString = `${queryString.substring(
          0,
          queryString.indexOf('0') + 1,
        )}${topicAndSearchQuery}${queryString.substring(
          queryString.indexOf('0') + 1,
          queryString.length,
        )}`;
      } else {
        if (filterData.searchString) {
          queryString = `${queryString.substring(
            0,
            queryString.indexOf('0') + 1,
          )} AND (word LIKE CONCAT("%", ? , "%"))${queryString.substring(
            queryString.indexOf('0') + 1,
            queryString.length,
          )}`;
          queryArray.push(filterData.searchString);
        }
      }
      queryArray.push(offSet);
      queryArray.push(filterData.pageSize);

      const filteredWords: IGetWordsDataModel[] = await db.query<
        IGetWordsDataModel[]
      >(queryString, queryArray);

      return Promise.resolve(filteredWords);
    } catch (err) {
      return Promise.reject(err);
    }
  },

  async getTotalElementsForFilter(
    filterData: IFilterFormDataModel,
  ): Promise<IDBCountResultDataModel> {
    let queryString = `SELECT COUNT(*) FROM ${config.mysql.database}.?? WHERE isDeleted = 0 ORDER BY word`;
    const queryArray: (string | number)[] = [`${filterData.language}`];

    if (filterData.topics?.length && filterData.topics.length > 0) {
      let topicAndSearchQuery = ' AND';
      filterData.topics!.forEach((topic, i) => {
        i === filterData.topics!.length - 1
          ? (topicAndSearchQuery = `${topicAndSearchQuery} (topic = ?) `)
          : (topicAndSearchQuery = `${topicAndSearchQuery} (topic = ?) OR`);
        queryArray.push(topic);
      });

      if (filterData.searchString) {
        topicAndSearchQuery =
          topicAndSearchQuery = `${topicAndSearchQuery} AND (word LIKE CONCAT("%", ? , "%")) `;
        queryArray.push(filterData.searchString);
      }

      queryString = `${queryString.substring(
        0,
        queryString.indexOf('0') + 1,
      )}${topicAndSearchQuery}${queryString.substring(
        queryString.indexOf('0') + 1,
        queryString.length,
      )}`;
    } else {
      if (filterData.searchString) {
        queryString = `${queryString.substring(
          0,
          queryString.indexOf('0') + 1,
        )} AND (word LIKE CONCAT("%", ? , "%"))${queryString.substring(
          queryString.indexOf('0') + 1,
          queryString.length,
        )}`;
        queryArray.push(filterData.searchString);
      }
    }

    const result: IDBCountResultDataModel[] = await db.query<
      IDBCountResultDataModel[]
    >(queryString, queryArray);
    return result[0];
  },

  async getRandomWords(
    lang: Language,
    quantity: number,
    topics: TopicType[],
  ): Promise<IGetWordsDataModel[]> {
    try {
      let queryString = `SELECT id, word${
        lang === Language.DE ? ', gender ' : ''
      }, numOfTranslations, topic FROM ${
        config.mysql.database
      }.?? WHERE isDeleted = 0 ORDER BY RAND() LIMIT ?;`;
      const queryArray: (string | number)[] = [`${lang}`];

      if (topics?.length > 0) {
        let topicQuery = ' AND';
        topics.forEach((topic, i) => {
          i === topics.length - 1
            ? (topicQuery = `${topicQuery} (topic = ?) `)
            : (topicQuery = `${topicQuery} (topic = ?) OR`);
          queryArray.push(topic);
        });
        queryString = `${queryString.substring(
          0,
          queryString.indexOf('0') + 1,
        )}${topicQuery}${queryString.substring(
          queryString.indexOf('0') + 1,
          queryString.length,
        )}`;
      }
      queryArray.push(quantity);

      const randomWords: IGetWordsDataModel[] = await db.query<
        IGetWordsDataModel[]
      >(queryString, queryArray);

      if (randomWords.length < quantity) {
        throw notSatisfiableError('Nincs elég szó az adatbázisban a játékhoz.');
      }

      return Promise.resolve(randomWords);
    } catch (err) {
      return Promise.reject(err);
    }
  },
};
