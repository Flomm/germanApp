import { Gender } from '../Enums/Gender.enum';
import { TopicType } from '../Enums/TopicType.enum';
import ITranslationDataModel from './ITranslationDataModel';

export default interface IGetWordsDataModel {
  id: number;
  word: string;
  gender?: Gender;
  topic: TopicType;
  numOfTranslations?: number;
  translations?: ITranslationDataModel[];
}
