import { db } from "../data/connection";
import { addTranslations } from "./addTranslationRepo";
import IAddWordDataModel from "../models/IAddWordDataModel";

export const wordRepository = {
  getWordByWord(lang: string, word: string): Promise<any> {
    return db
      .query<any[]>(`SELECT * FROM german_app.${lang} WHERE word = ?`, [word])
      .then((res) => res[0])
      .catch((err) => Promise.reject(err));
  },

  getWordById(lang: string, wordId: number): Promise<any> {
    return db
      .query<any[]>(
        `SELECT * FROM german_app.${lang} WHERE id = ? AND isDeleted = 0`,
        [`${lang}`, `${wordId}`]
      )
      .then((res) => res[0])
      .catch((err) => Promise.reject(err));
  },

  async addWord(lang: string, newWord: IAddWordDataModel): Promise<any> {
    try {
      let queryString: string = `UPDATE german_app.${lang} SET isDeleted = 0 WHERE id = ?`;
      const existingWord: any = await wordRepository.getWordByWord(
        lang,
        newWord.word
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
          throw new Error("A szó már szerepel az adatbázisban.");
        }
      } else {
        let queryArray: string[] = [
          newWord.word,
          `${newWord.translations.length}`,
          `${newWord.topic}`,
        ];
        if (lang === "de" && newWord.gender) {
          queryString = `INSERT INTO german_app.${lang} (word, numOfTranslations, topic, gender) VALUES (?, ?, ?, ?)`;
          queryArray.push(newWord.gender);
        } else {
          queryString = `INSERT INTO german_app.${lang} (word, numOfTranslations, topic) VALUES (?, ?, ?)`;
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
    newWord: IAddWordDataModel
  ): Promise<any> {
    try {
      await wordRepository.addWord(lang, newWord);
      const addedWord: any = await wordRepository.getWordByWord(
        lang,
        newWord.word
      );
      return Promise.resolve(
        addTranslations(lang, addedWord.id, newWord.translations)
      );
    } catch (err) {
      return Promise.reject(err);
    }
  },
};
