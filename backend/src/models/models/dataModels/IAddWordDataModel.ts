import { Gender } from '../Enums/Gender.enum';

export default interface IAddWordDataModel {
  word: string;
  translations: string[];
  gender?: Gender;
}
