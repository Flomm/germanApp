import { db } from "../../data/connection";
import IGetWordsDataModel from "../../models/models/dataModels/IGetWordsDataModel";
import { Language } from "../../models/models/Enums/Language.enum";

export const wordRepository = {
    getAllWords(lang: Language): Promise<IGetWordsDataModel[]> {
        return db
        .query<IGetWordsDataModel[]>(
          `SELECT * FROM german_app.${lang} WHERE isDeleted = 0 ORDER BY word `,[]
        )
        .catch(err => Promise.reject(err));
    }
}