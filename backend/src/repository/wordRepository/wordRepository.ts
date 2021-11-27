import { db } from "../../data/connection";
import IAddWordDataModel from "../../models/models/dataModels/IAddWordDataModel";
import IDbResultDataModel from "../../models/models/dataModels/IDbResultDataModel";
import IGetWordsDataModel from "../../models/models/dataModels/IGetWordsDataModel";
import { Language } from "../../models/models/Enums/Language.enum";
import { badRequestError, serverError } from "../../services/errorCreatorService/errorCreator.service";

export const wordRepository = {
    getAllWords(lang: Language): Promise<IGetWordsDataModel[]> {
        return db
        .query<IGetWordsDataModel[]>(
          `SELECT * FROM german_app.${lang} WHERE isDeleted = 0 ORDER BY word `,[]
        )
        .catch(err => Promise.reject(err));
    },

    getWordByWord(lang: Language, word: string): Promise<IGetWordsDataModel> {
      return db
      .query<IGetWordsDataModel>(
        `SELECT * FROM german_app.${lang} WHERE word = ? AND isDeleted = 0`,[word]
      )
      .catch(err => Promise.reject(err));
    },
//SZAR!!
    addWord(lang: Language, newWord: IAddWordDataModel): Promise<IDbResultDataModel> {
      db.query<IDbResultDataModel>(`SELECT * FROM german_app.${lang} WHERE word === ?`, [newWord.word]).then((res)=>{
        if (res.affectedRows === 0) {
          Promise.reject(badRequestError('A szó már szerepel az adatbázisban.'))
        }
        let queryString: string;
        let queryArray: string[]
        if(lang === Language.DE) {
          queryString = `INSERT INTO german_app.${lang} (word, gender) VALUES (?, ?)`
          queryArray = [newWord.word, newWord.gender!]
        } else {
          queryString = `INSERT INTO german_app.${lang} (word) VALUES (?)`
          queryArray = [newWord.word,]
        }
        db.query<IDbResultDataModel>(
         queryString,
          queryArray,
        ).then((res)=>{
          if (res.affectedRows === 0) {
            Promise.reject(serverError('Nem sikerült hozzáadni a szót.'))
          }
          wordRepository.getWordByWord(lang, newWord.word)

        })
        .catch(err => Promise.reject(err));
        
      }).catch(err => Promise.reject(err));

      return db.query<IDbResultDataModel>(
        `INSERT INTO german_app.${lang} (word, gender) VALUES (?, ?)`,
        [`${newWord}`],
      )
      .catch(err => Promise.reject(err));
    },
    
    removeWord(wordId: number, lang: Language): Promise<IDbResultDataModel> {
      return db.query<IDbResultDataModel>(
        `UPDATE german_app.${lang} SET isDeleted = 1 WHERE id = ?`,
        [`${wordId}`],
      )
      .catch(err => Promise.reject(err));
    }
}