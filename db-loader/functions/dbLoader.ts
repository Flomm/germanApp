import IAddWordDataModel from "../models/IAddWordDataModel";
import IExcelObjectModel from "../models/IExcelObjectModel";
import { wordRepository } from "./addWordRepo";
import { excelReader } from "./excelReader";
import { rowToObjectTransformer } from "./rowToObjectTransformer";

export const dbLoader = (fileName: string, language: string): void => {
  try {
    console.log(`Start loading ${language} words...`);
    const excelFileData: IExcelObjectModel[] = excelReader(fileName);
    const wordObjectList: IAddWordDataModel[][] = rowToObjectTransformer(
      excelFileData,
      language
    );
    wordObjectList.forEach((wordArray) => {
      if (wordArray.length > 0) {
        wordArray.forEach((wordObj) => {
          wordRepository
            .addNewWordEntry(language, wordObj)
            .catch((err) => Promise.reject(err));
        });
      }
    });
  } catch (error) {
    throw error;
  }
};
