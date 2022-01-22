import { Gender } from '../enums/Gender.enum';
import { TopicType } from '../enums/TopicType.enum';

export default interface IGetWordData {
  id: number;
  word: string;
  topic: TopicType;
  gender?: Gender;
  numOfTranslations?: number;
}
