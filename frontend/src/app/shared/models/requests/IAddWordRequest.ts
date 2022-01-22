import { Gender } from '../enums/Gender.enum';
import { TopicType } from '../enums/TopicType.enum';
import ITranslationDataModel from './ITranslationDataModel';

export default interface IAddWordRequest {
  word: string;
  translations: ITranslationDataModel[];
  topic: TopicType;
  gender?: Gender;
}
