import IGetWordsDataModel from '../../models/models/dataModels/IGetWordsDataModel';
import ITranslationDataModel from '../../models/models/dataModels/ITranslationDataModel';
import { Language } from '../../models/models/Enums/Language.enum';
import { TopicType } from '../../models/models/Enums/TopicType.enum';
import ICheckAnswerRequest from '../../models/requests/ICheckAnswerRequest';
import ICheckAnswerResponse from '../../models/responses/ICheckAnswerResponse';
import { translationRepository } from '../../repository/translationRepository/translationRepository';
import { wordRepository } from '../../repository/wordRepository/wordRepository';

export const gameService = {
  getRandomWords(
    lang: Language,
    quantity: number,
    topics: TopicType[],
  ): Promise<IGetWordsDataModel[]> {
    return wordRepository
      .getRandomWords(lang, quantity, topics)
      .then(res => {
        return res.map(word => {
          if (!word.gender) {
            return {
              id: word.id,
              word: word.word,
              numOfTranslations: word.numOfTranslations,
              topic: word.topic,
            };
          }
          return word;
        });
      })
      .catch(err => Promise.reject(err));
  },

  async checkAnswer(
    lang: Language,
    checkRequest: ICheckAnswerRequest,
  ): Promise<ICheckAnswerResponse> {
    try {
      const translationsWithNull: ITranslationDataModel[] =
        await translationRepository.getTranslationsByWordId(
          lang,
          checkRequest.wordId,
        );

      const translations: ITranslationDataModel[] = translationsWithNull.map(
        translationObject => {
          if (!translationObject.gender) {
            return { translation: translationObject.translation };
          }
          return translationObject;
        },
      );

      const translationsToWord: string[] = translations.map(
        translation =>
          `${translation.gender ? translation.gender + ' ' : ''}${
            translation.translation
          }`,
      );

      const isCorrect: boolean = checkRequest.answerList.some(answer => {
        return translationsToWord.includes(
          `${answer.gender ? answer.gender + ' ' : ''}${answer.answer}`,
        );
      });

      return { isCorrect, translations };
    } catch (error) {
      return Promise.reject(error);
    }
  },
};
