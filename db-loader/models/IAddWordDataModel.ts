import ITranslationDataModel from "./ITranslationDataModel";

export default interface IAddWordDataModel {
  word: string;
  translations: ITranslationDataModel[];
  topic: number;
  gender?: string;
}
