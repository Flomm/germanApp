import ITranslationDataModel from '../requests/ITranslationDataModel';

export default interface ICheckAnswerResponse {
  isCorrect: boolean;
  translations: ITranslationDataModel[];
  isError?: boolean;
  message?: string;
}
