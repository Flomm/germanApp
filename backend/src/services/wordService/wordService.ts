import IGetWordsDataModel from "../../models/models/dataModels/IGetWordsDataModel";
import { Language } from "../../models/models/Enums/Language.enum";
import { wordRepository } from "../../repository/wordRepository/wordRepository";

export const wordService = {
    getAllWords(lang: Language): Promise<IGetWordsDataModel[]> {
        return wordRepository.getAllWords(lang).catch(err => Promise.reject(err));
      },
}