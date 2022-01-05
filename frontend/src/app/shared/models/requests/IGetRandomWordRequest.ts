import { Language } from '../enums/Language.enum';

export default interface IGetRandomWordRequest {
  quantity: number;
  language: Language;
}
