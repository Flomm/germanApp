import { Language } from '../../../models/models/Enums/Language.enum';

export default function languageChecker(lang: string): boolean {
  return (<any>Object).values(Language).includes(lang);
}
