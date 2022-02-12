import { Language } from '../enums/Language.enum';
import { TopicType } from '../enums/TopicType.enum';

export default interface IFilterFormData {
  language: Language;
  pageNumber: number;
  pageSize: number;
  searchString?: string;
  topics?: TopicType[];
}
