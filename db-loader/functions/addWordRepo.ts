import { db } from "../data/connection";
import { addTranslations } from "./addTranslationRepo";
import IAddWordDataModel from "../models/IAddWordDataModel";
import dbConfig from "../data/dbConfig";
import { EnvType } from "../models/EnvType.enum";

export const wordRepository = {
  getWordByWord(lang: string, word: string, env: EnvType): Promise<any> {
    return db
      .query<any[]>(
        `SELECT * FROM ${dbConfig[env].database}.${lang} WHERE word = ?`,
        [word]
      )
      .then((res) => res[0])
      .catch((err) => Promise.reject(err));
  },

  getWordById(lang: string, wordId: number, env: EnvType): Promise<any> {
    return db
      .query<any[]>(
        `SELECT * FROM ${dbConfig[env].database}.${lang} WHERE id = ? AND isDeleted = 0`,
        [`${lang}`, `${wordId}`]
      )
      .then((res) => res[0])
      .catch((err) => Promise.reject(err));
  },

  async addWord(
    lang: string,
    newWord: IAddWordDataModel,
    env: EnvType
  ): Promise<any> {
    try {
      let queryString: string = `UPDATE ${dbConfig[env].database}.${lang} SET isDeleted = 0 WHERE id = ?`;
      const existingWord: any = await wordRepository.getWordByWord(
        lang,
        newWord.word,
        env
      );
      if (existingWord) {
        if (existingWord.isDeleted) {
          const dbResult: any = await db.query<any>(queryString, [
            `${existingWord.id}`,
          ]);
          if (dbResult.affectedRows === 0) {
            throw new Error("Nem sikerült hozzáadni a szót.");
          }
          return Promise.resolve(dbResult);
        } else {
          console.log(`Existing word: ${newWord.word}`);
          throw new Error("A szó már szerepel az adatbázisban.");
        }
      } else {
        let queryArray: string[] = [
          newWord.word,
          `${newWord.translations.length}`,
          `${newWord.topic}`,
        ];
        if (lang === "de" && newWord.gender) {
          queryString = `INSERT INTO ${dbConfig[env].database}.${lang} (word, numOfTranslations, topic, gender) VALUES (?, ?, ?, ?)`;
          queryArray.push(newWord.gender);
        } else {
          queryString = `INSERT INTO ${dbConfig[env].database}.${lang} (word, numOfTranslations, topic) VALUES (?, ?, ?)`;
        }
        const dbResult: any = await db.query<any>(queryString, queryArray);
        if (dbResult.affectedRows === 0) {
          throw new Error("Nem sikerült hozzáadni a szót.");
        }
        return Promise.resolve(dbResult);
      }
    } catch (err) {
      return Promise.reject(err);
    }
  },

  async addNewWordEntry(
    lang: string,
    newWord: IAddWordDataModel,
    env: EnvType
  ): Promise<any> {
    try {
      await wordRepository.addWord(lang, newWord, env);
      const addedWord: any = await wordRepository.getWordByWord(
        lang,
        newWord.word,
        env
      );
      return Promise.resolve(
        addTranslations(lang, addedWord.id, newWord.translations, env)
      );
    } catch (err) {
      return Promise.reject(err);
    }
  },
};
