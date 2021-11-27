import IAddWordDataModel from "../../models/models/dataModels/IAddWordDataModel";
import IGetWordsDataModel from "../../models/models/dataModels/IGetWordsDataModel";
import { Language } from "../../models/models/Enums/Language.enum";
import { wordRepository } from "../../repository/wordRepository/wordRepository";
import { notFoundError } from "../errorCreatorService/errorCreator.service";

export const wordService = {
    getAllWords(lang: Language): Promise<IGetWordsDataModel[]> {
        return wordRepository.getAllWords(lang).catch(err => Promise.reject(err));
      },

    addWord(lang: Language, newWord: IAddWordDataModel): Promise<void>  {
      return wordRepository.addWord(lang, newWord).then(dbResult => {
        if (dbResult.affectedRows === 0) {
          return Promise.reject(notFoundError('A hozzáadás nem sikerült.'));
        }
      });
    },

    removeWord(wordId: number, lang: Language): Promise<void> {
      return wordRepository.removeWord(wordId, lang).then(dbResult => {
        if (dbResult.affectedRows === 0) {
          return Promise.reject(notFoundError('A szó id nem található.'));
        }
      });
    }
}