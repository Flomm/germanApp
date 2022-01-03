import IRandomWordDataModel from '../models/dataModels/IRandomWordDataModel';

export default interface IRandomWordResponse {
  message?: string;
  isError?: boolean;
  randomWordList: IRandomWordDataModel[];
}
