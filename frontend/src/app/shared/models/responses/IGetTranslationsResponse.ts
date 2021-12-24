import ITranslationDataModel from '../requests/ITranslationDataModel';

export default interface IGetTranslationsResponse {
  translationList: ITranslationDataModel[];
  message?: string;
  isError?: boolean;
}
