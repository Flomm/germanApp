import { Language } from '../enums/Language.enum';
import IGetWordData from './IGetWordData.viewModel';

export default interface IModifyWordDialogData {
  language: Language;
  wordData: IGetWordData;
}
