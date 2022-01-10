import ITranslationDataModel from '../models/dataModels/ITranslationDataModel';

export default interface ICheckAnswerResponse {
  isCorrect: boolean;
  translations?: ITranslationDataModel[];
}
