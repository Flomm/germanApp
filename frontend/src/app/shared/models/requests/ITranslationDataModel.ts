import { Gender } from '../enums/Gender.enum';

export default interface ITranslationDataModel {
  translation: string;
  gender?: Gender;
}
