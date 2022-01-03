import IRandomWordData from '../models/viewModels/IRandomWordData.viewModel';

export default interface IGetRandomWordResponse {
  message?: string;
  isError?: boolean;
  randomWordList: IRandomWordData[];
}
