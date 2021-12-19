import { Gender } from '../enums/Gender.enum';

export default interface IAddTranslationDataModel {
  translation: string;
  gender?: Gender;
}
