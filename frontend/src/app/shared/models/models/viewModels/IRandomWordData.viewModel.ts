import { Gender } from '../../enums/Gender.enum';

export default interface IRandomWordData {
  id: number;
  word: string;
  gender?: Gender;
}
