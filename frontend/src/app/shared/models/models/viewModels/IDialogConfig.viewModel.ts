import IModifyWordDialogData from './IModifyWordDialogData.viewModel';

export default interface IDialogConfig {
  isCancelButtonVisible?: boolean;
  cancelButtonText?: string;
  okButtonText?: string;
  isClosable?: boolean;
  dialogText: string;
  modifyWordData: IModifyWordDialogData;
}
