import { Gender } from "../Enums/Gender.enum";

export default interface IAddWordDataModel {
    id: number,
    word: string,
    translations: string[],
    gender?: Gender,
  }