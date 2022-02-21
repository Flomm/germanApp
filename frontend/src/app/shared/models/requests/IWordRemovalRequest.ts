import { Language } from '../enums/Language.enum';

export default interface IWordRemovalRequest {
  language: Language;
  wordId: number;
}
