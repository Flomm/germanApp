import { Language } from '../../../models/models/Enums/Language.enum';

export default function languageChecker(lang: Language): boolean {
  return !(<any>Object).values(Language).includes(lang);
}
