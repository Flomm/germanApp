import { Gender } from '../Enums/Gender.enum';

export default interface IAddTranslationDataModel {
  translation: string;
  gender?: Gender;
}
