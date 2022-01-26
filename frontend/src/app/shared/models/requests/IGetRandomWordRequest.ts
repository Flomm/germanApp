import { Language } from '../enums/Language.enum';
import { TopicType } from '../enums/TopicType.enum';

export default interface IGetRandomWordRequest {
  quantity: number;
  language: Language;
  topic?: TopicType;
}
