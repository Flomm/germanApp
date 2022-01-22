import { Gender } from '../enums/Gender.enum';

export default interface IAnswer {
  answer: string;
  gender?: Gender;
}
