import { db } from "../../data/connection";
import IGetWordsDataModel from "../../models/models/dataModels/IGetWordsDataModel";

export const wordRepository = {
    getAllWords(lang: string): Promise<IGetWordsDataModel[]> {
        return db
        .query<IGetWordsDataModel[]>(
          'SELECT f.*, s.word FROM german_app.user',
          [],
        )
        .catch(err => Promise.reject(err));
    }
}