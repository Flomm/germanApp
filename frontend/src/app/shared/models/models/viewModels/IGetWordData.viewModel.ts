import { Gender } from '../../enums/Gender.enum';

export default interface IGetWordData {
  id: number;
  word: string;
  gender?: Gender;
  numOfTranslations?: number;
}
