import IGetWordsDataModel from "../../models/models/dataModels/IGetWordsDataModel";
import { wordRepository } from "../../repository/wordRepository/wordRepository";

export const wordService = {
    getAllWords(lang: string): Promise<IGetWordsDataModel[]> {
        return wordRepository.getAllWords(lang).catch(err => Promise.reject(err));
      },
}