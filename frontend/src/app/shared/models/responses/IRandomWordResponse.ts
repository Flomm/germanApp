import IRandomWordData from '../models/viewModels/IRandomWordData.viewModel';

export default interface IRandomWordResponse {
  message?: string;
  isError?: boolean;
  randomWordList: IRandomWordData[];
}
