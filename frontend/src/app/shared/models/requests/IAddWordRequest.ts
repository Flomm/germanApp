import { Gender } from '../enums/Gender.enum';
import ITranslationDataModel from './ITranslationDataModel';

export default interface IAddWordRequest {
  word: string;
  translations: ITranslationDataModel[];
  gender?: Gender;
}
