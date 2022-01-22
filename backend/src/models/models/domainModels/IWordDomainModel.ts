import { Gender } from '../Enums/Gender.enum';
import { TopicType } from '../Enums/TopicType.enum';

export default interface IGetWordsDomainModel {
  id: number;
  word: string;
  isDeleted: boolean;
  topic: TopicType;
  gender?: Gender;
  numOfTranslations?: number;
}
