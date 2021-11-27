import { Gender } from "../Enums/Gender.enum";

export default interface IAddWordDataModel {
    id: number,
    word: string,
    gender?: Gender,
    translations?: string[]
  }