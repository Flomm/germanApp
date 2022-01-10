import IGetWordsDataModel from '../../models/models/dataModels/IGetWordsDataModel';
import ITranslationDataModel from '../../models/models/dataModels/ITranslationDataModel';
import { Language } from '../../models/models/Enums/Language.enum';
import ICheckAnswerRequest from '../../models/requests/ICheckAnswerRequest';
import ICheckAnswerResponse from '../../models/responses/ICheckAnswerResponse';
import { translationRepository } from '../../repository/translationRepository/translationRepository';
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

  async checkAnswer(lang: Language, checkRequest: ICheckAnswerRequest) {
    const translations: ITranslationDataModel[] =
      await translationRepository.getTranslationsByWordId(
        lang,
        checkRequest.wordId,
      );
    const translationsToWord: string[] = translations.map(
      translation =>
        `${translation.gender ? translation.gender + ' ' : ''}${
          translation.translation
        }`,
    );
    console.warn(translationsToWord);
    const isCorrect: boolean = checkRequest.answerList.some(answer => {
      console.warn(
        `${answer.gender ? answer.gender + ' ' : ''}${answer.answer}`,
      );
      return translationsToWord.includes(
        `${answer.gender ? answer.gender + ' ' : ''}${answer.answer}`,
      );
    });
    console.warn(isCorrect);
  },
};
