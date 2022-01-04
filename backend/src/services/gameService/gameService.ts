import IGetWordsDataModel from '../../models/models/dataModels/IGetWordsDataModel';
import { Language } from '../../models/models/Enums/Language.enum';
import { wordRepository } from '../../repository/wordRepository/wordRepository';

export const gameService = {
  getRandomWords(
    lang: Language,
    quantity: number,
  ): Promise<IGetWordsDataModel[]> {
    return wordRepository
      .getRandomWords(lang, quantity)
      .then(res => {
        return res.map(word => {
          if (!word.gender) {
            return { id: word.id, word: word.word };
          }
          return word;
        });
      })
      .catch(err => Promise.reject(err));
  },
};
