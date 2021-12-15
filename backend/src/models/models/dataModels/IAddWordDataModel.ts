import { Gender } from '../Enums/Gender.enum';
import IAddTranslationDataModel from './IAddTranslationDataModel';

export default interface IAddWordDataModel {
  word: string;
  translations: IAddTranslationDataModel[];
  gender?: Gender;
}
