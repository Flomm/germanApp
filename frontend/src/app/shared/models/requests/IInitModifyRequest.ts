import { Language } from '../enums/Language.enum';

export default interface IInitModifyRequest {
  wordId: number;
  language: Language;
  word: string;
}
