import { Gender } from '../enums/Gender.enum';
import IAddTranslationDataModel from './IAddTranslationDataModel';

export default interface IAddWordRequest {
  word: string;
  translations: IAddTranslationDataModel[];
  gender?: Gender;
}
