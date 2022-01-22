import IInitModifyRequest from '../requests/IInitModifyRequest';
import ITranslationDataModel from '../requests/ITranslationDataModel';

export default interface IModifyWordDialogData {
  initRequest: IInitModifyRequest;
  translationList: ITranslationDataModel[];
}
