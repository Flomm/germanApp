import { db } from "../../data/connection";
import IDbResultDataModel from "../../models/models/dataModels/IDbResultDataModel";
import IGetWordsDataModel from "../../models/models/dataModels/IGetWordsDataModel";
import { Language } from "../../models/models/Enums/Language.enum";

export const wordRepository = {
    getAllWords(lang: Language): Promise<IGetWordsDataModel[]> {
        return db
        .query<IGetWordsDataModel[]>(
          `SELECT * FROM german_app.${lang} WHERE isDeleted = 0 ORDER BY word `,[]
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