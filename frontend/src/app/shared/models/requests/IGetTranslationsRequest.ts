import { Language } from '../enums/Language.enum';

export default interface IGetTranslationsRequest {
  id: number;
  language: Language;
}
