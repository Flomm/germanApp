import { Gender } from '../Enums/Gender.enum';
import ITranslationDataModel from './ITranslationDataModel';

export default interface IAddWordDataModel {
  word: string;
  translations: ITranslationDataModel[];
  gender?: Gender;
}
