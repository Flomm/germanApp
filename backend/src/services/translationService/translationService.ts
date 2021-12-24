import ITranslationDataModel from '../../models/models/dataModels/ITranslationDataModel';
import { Language } from '../../models/models/Enums/Language.enum';
import { translationRepository } from '../../repository/translationRepository/translationRepository';

export const translationService = {
  getTranslationsByWordId(
    lang: Language,
    wordId: number,
  ): Promise<ITranslationDataModel[]> {
    return translationRepository
      .getTranslationsByWordId(lang, wordId)
      .then(res => {
        return res.map(translationObject => {
          if (!translationObject.gender) {
            return { translation: translationObject.translation };
          }
          return translationObject;
        });
      })
      .catch(err => Promise.reject(err));
  },
};
