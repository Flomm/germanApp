import IAnswer from '../models/viewModels/IAnswer.viewModel';

export default interface ICheckAnswerRequest {
  wordId: number;
  answerList: IAnswer[];
}
