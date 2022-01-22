import IAnswer from '../viewModels/IAnswer.viewModel';

export default interface ICheckAnswerRequest {
  wordId: number;
  answerList: IAnswer[];
}
