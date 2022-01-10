import IAnswer from '../models/dataModels/IAnswerDataModel';

export default interface ICheckAnswerRequest {
  wordId: number;
  answerList: IAnswer[];
}
