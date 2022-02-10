import { Language } from '../Enums/Language.enum';
import { TopicType } from '../Enums/TopicType.enum';

export default interface IFilterFormDataModel {
  language: Language;
  pageNumber: number;
  pageSize: number;
  searchString?: string;
  topics?: TopicType[];
}
