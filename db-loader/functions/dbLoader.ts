import { resolve } from "path/posix";
import { EnvType } from "../models/EnvType.enum";
import IAddWordDataModel from "../models/IAddWordDataModel";
import IExcelObjectModel from "../models/IExcelObjectModel";
import { wordRepository } from "./addWordRepo";
import { excelReader } from "./excelReader";
import { rowToObjectTransformer } from "./rowToObjectTransformer";

export const dbLoader = async (
  fileName: string,
  language: string,
  env: EnvType
): Promise<void> => {
  try {
    console.log(`Start loading ${language} words...`);
    const excelFileData: IExcelObjectModel[] = await excelReader(fileName);
    const wordObjectList: IAddWordDataModel[][] = await rowToObjectTransformer(
      excelFileData,
      language
    );
    const wordAddPromises: Promise<any>[] = [];
    wordObjectList.forEach((wordArray) => {
      if (wordArray.length > 0) {
        wordArray.forEach((wordObj) => {
          wordAddPromises.push(
            wordRepository.addNewWordEntry(language, wordObj, env)
          );
        });
      }
    });
    await Promise.all(wordAddPromises);
    resolve();
  } catch (err) {
    throw err;
  }
};
