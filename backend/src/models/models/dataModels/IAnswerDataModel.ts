import { Gender } from '../Enums/Gender.enum';

export default interface IAnswer {
  answer: string;
  gender?: Gender;
}
