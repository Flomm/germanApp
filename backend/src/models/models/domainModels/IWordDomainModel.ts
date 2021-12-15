import { Gender } from '../Enums/Gender.enum';

export default interface IGetWordsDomainModel {
  id: number;
  word: string;
  gender?: Gender;
  isDeleted: boolean;
}
