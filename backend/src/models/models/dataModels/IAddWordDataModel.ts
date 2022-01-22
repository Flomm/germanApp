import { Gender } from '../Enums/Gender.enum';
import { TopicType } from '../Enums/TopicType.enum';
import ITranslationDataModel from './ITranslationDataModel';

export default interface IAddWordDataModel {
  word: string;
  translations: ITranslationDataModel[];
  topic: TopicType;
  gender?: Gender;
}
