import { Gender } from '../Enums/Gender.enum';
import { TopicType } from '../Enums/TopicType.enum';

export default interface IGetWordsDataModel {
  id: number;
  word: string;
  gender?: Gender;
  topic: TopicType;
  numOfTranslations?: number;
}
