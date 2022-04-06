import { db } from "../data/connection";
import dbConfig from "../data/dbConfig";
import { EnvType } from "../models/EnvType.enum";
import ITranslationDataModel from "../models/ITranslationDataModel";
import { generateMultipleInsertQueryQuestionMarks } from "./multipleInsertionHelper";

export function addTranslations(
  lang: string,
  newWordId: number,
  translations: ITranslationDataModel[],
  env: EnvType
): Promise<any> {
  return db
    .query<any>(
      `INSERT INTO ${
        dbConfig[env].database
      }.translation (lang, wordId, translation, gender) VALUES ${generateMultipleInsertQueryQuestionMarks(
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
