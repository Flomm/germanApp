import { Gender } from "../Enums/Gender.enum";

export default interface IAddTranslationWordDataModel {
    word: string,
    gender?: Gender
}