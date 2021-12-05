import { Gender } from "../Enums/Gender.enum";
import IAddTranslationWordDataModel from "./IAddTranslationWordDataModel";

export default interface IAddWordDataModel {
    id: number,
    word: string,
    translations: IAddTranslationWordDataModel[],
    gender?: Gender,
  }