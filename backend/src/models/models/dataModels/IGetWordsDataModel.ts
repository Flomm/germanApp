import { Gender } from '../Enums/Gender.enum';

export default interface IGetWordsDataModel {
  id: number;
  word: string;
  gender?: Gender;
  numOfTranslations?: number;
}
