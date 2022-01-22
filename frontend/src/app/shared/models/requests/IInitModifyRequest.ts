import { Gender } from '../enums/Gender.enum';
import { Language } from '../enums/Language.enum';
import { TopicType } from '../enums/TopicType.enum';

export default interface IInitModifyRequest {
  wordId: number;
  language: Language;
  word: string;
  topic: TopicType;
  gender?: Gender;
}
