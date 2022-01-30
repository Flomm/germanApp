import { db } from "../data/connection";
import IAddWordDataModel from "../models/IAddWordDataModel";
import IExcelObjectModel from "../models/IExcelObjectModel";
import { excelReader } from "./excelReader";
import { rowToObjectTransformer } from "./rowToObjectTransformer";

export const dbLoader = (fileName: string, language: string): void => {
  db.checkConnection()
    .then(() => {
      const excelFileData: IExcelObjectModel[] = excelReader(fileName);
      const wordObjectList: IAddWordDataModel[][] = rowToObjectTransformer(
        excelFileData,
        language
      );
    })
    .catch((err) => {
      console.log(err.message);
    });
};
