import IRandomWordDataModel from '../models/dataModels/IRandomWordDataModel';

export default interface IGetRandomWordResponse {
  message?: string;
  isError?: boolean;
  randomWordList: IRandomWordDataModel[];
}
