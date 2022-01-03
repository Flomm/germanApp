import { Gender } from '../Enums/Gender.enum';

export default interface IRandomWordDataModel {
  id: number;
  word: string;
  gender?: Gender;
}
