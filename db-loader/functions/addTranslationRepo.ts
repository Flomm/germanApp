import { db } from "../data/connection";
import ITranslationDataModel from "../models/ITranslationDataModel";
import { generateMultipleInsertQueryQuestionMarks } from "./multipleInsertionHelper";

export function addTranslations(
  lang: string,
  newWordId: number,
  translations: ITranslationDataModel[]
): Promise<any> {
  return db
    .query<any>(
      `INSERT INTO german_app.translation (lang, wordId, translation, gender) VALUES ${generateMultipleInsertQueryQuestionMarks(
        4,
        translations.length
      )}`,
      translations
        .map((trans) => [
          `${lang}`,
          `${newWordId}`,
          `${trans.translation}`,
          trans.gender!,
        ])
        .reduce((acc, val) => acc.concat(val), [])
    )
    .catch((err) => Promise.reject(err));
}
