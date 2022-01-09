import IGetWordData from '../models/viewModels/IGetWordData.viewModel';

export default interface IGetWordResponse {
  wordList: IGetWordData[];
  message?: string;
  isError?: boolean;
}
