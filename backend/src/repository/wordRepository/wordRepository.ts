import { db } from '../../data/connection';
import IAddWordDataModel from '../../models/models/dataModels/IAddWordDataModel';
import IDBCountResultDataModel from '../../models/models/dataModels/IDBCountResultDataModel';
import IDbResultDataModel from '../../models/models/dataModels/IDbResultDataModel';
import IGetWordsDataModel from '../../models/models/dataModels/IGetWordsDataModel';
import IGetWordsDomainModel from '../../models/models/domainModels/IWordDomainModel';
import { Language } from '../../models/models/Enums/Language.enum';
import { TopicType } from '../../models/models/Enums/TopicType.enum';
import {
  badRequestError,
  notFoundError,
  notSatisfiableError,
  serverError,
} from '../../services/errorCreatorService/errorCreator.service';
import { translationRepository } from '../translationRepository/translationRepository';

export const wordRepository = {
  getAllWords(lang: Language): Promise<IGetWordsDataModel[]> {
    return db
      .query<IGetWordsDataModel[]>(
        `SELECT * FROM german_app.?? WHERE isDeleted = 0 ORDER BY word`,
        [`${lang}`],
      )
      .catch(err => Promise.reject(err));
  },

  getWordByWord(lang: Language, word: string): Promise<IGetWordsDomainModel> {
    return db
      .query<IGetWordsDomainModel[]>(
        `SELECT * FROM german_app.?? WHERE word = ?`,
        [`${lang}`, word],
      )
      .then(res => res[0])
      .catch(err => Promise.reject(err));
  },

  getWordById(lang: Language, wordId: number): Promise<IGetWordsDomainModel> {
    return db
      .query<IGetWordsDomainModel[]>(
        `SELECT * FROM german_app.?? WHERE id = ? AND isDeleted = 0`,
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
      let queryString: string = `UPDATE german_app.?? SET isDeleted = 0 WHERE id = ?`;
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
        let queryArray: string[] = [
          `${lang}`,
          newWord.word,
          `${newWord.translations.length}`,
          `${newWord.topic}`,
        ];
        if (lang === Language.DE && newWord.gender) {
          queryString = `INSERT INTO german_app.?? (word, numOfTranslations, topic, gender) VALUES (?, ?, ?, ?)`;
          queryArray.push(newWord.gender);
        } else {
          queryString = `INSERT INTO german_app.?? (word, numOfTranslations, topic) VALUES (?, ?, ?)`;
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
        `UPDATE german_app.?? SET isDeleted = 1 WHERE id = ?`,
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
    let queryString: string = `UPDATE german_app.?? SET word = ?, numOfTranslations = ?, topic = ? WHERE id = ?`;
    let queryArray: string[] = [
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
      queryString = `UPDATE german_app.?? SET gender = ?, word = ?, numOfTranslations = ?, topic = ? WHERE id = ?`;
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
    lang: Language,
    pageNumber: number,
    pageSize: number,
    topics: TopicType[],
  ): Promise<IGetWordsDataModel[]> {
    try {
      const offSet: number = (pageNumber - 1) * pageSize;
      let queryString: string = `SELECT id, word${
        lang === Language.DE ? ', gender ' : ''
      }, topic FROM german_app.?? WHERE isDeleted = 0 ORDER BY word LIMIT ?, ?;`;
      let queryArray: (string | number)[] = [`${lang}`];

      if (topics?.length > 0) {
        let topicQuery: string = ' AND';
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
      queryArray.push(offSet);
      queryArray.push(pageSize);

      const filteredWords: IGetWordsDataModel[] = await db.query<
        IGetWordsDataModel[]
      >(queryString, queryArray);

      if (filteredWords.length < pageSize) {
        throw notSatisfiableError('Nincs elég szó az adatbázisban a játékhoz.');
      }
      return Promise.resolve(filteredWords);
    } catch (err) {
      return Promise.reject(err);
    }
  },

  async getTotalElementsForFilter(
    lang: Language,
    topics: TopicType[],
  ): Promise<IDBCountResultDataModel> {
    let queryString: string = `SELECT COUNT(*) FROM german_app.?? WHERE isDeleted = 0 ORDER BY word`;
    let queryArray: (string | number)[] = [`${lang}`];

    if (topics?.length > 0) {
      let topicQuery: string = ' AND';
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
      let queryString: string = `SELECT id, word${
        lang === Language.DE ? ', gender ' : ''
      }, numOfTranslations, topic FROM german_app.?? WHERE isDeleted = 0 ORDER BY RAND() LIMIT ?;`;
      let queryArray: (string | number)[] = [`${lang}`];

      if (topics?.length > 0) {
        let topicQuery: string = ' AND';
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
