import { Gender } from "../Enums/Gender.enum";
import IAddTranslationWordDataModel from "./IAddTranslationWordDataModel";

export default interface IAddWordDataModel {
    word: string,
    translations: IAddTranslationWordDataModel[],
    gender?: Gender,
  }