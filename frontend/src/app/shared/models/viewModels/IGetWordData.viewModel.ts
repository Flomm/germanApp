import { Gender } from '../enums/Gender.enum';
import { TopicType } from '../enums/TopicType.enum';
import ITranslationDataModel from '../requests/ITranslationDataModel';

export default interface IGetWordData {
  id: number;
  word: string;
  topic: TopicType;
  gender?: Gender;
  numOfTranslations?: number;
  translations?: ITranslationDataModel[];
}
