import IGetWordData from '../viewModels/IGetWordData.viewModel';

export default interface IGetWordResponse {
  wordList: IGetWordData[];
  message?: string;
  isError?: boolean;
}
