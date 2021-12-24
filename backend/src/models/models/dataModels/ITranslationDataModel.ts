import { Gender } from '../Enums/Gender.enum';

export default interface ITranslationDataModel {
  translation: string;
  gender?: Gender;
}
