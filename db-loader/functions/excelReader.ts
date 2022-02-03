import xlsx from "node-xlsx";
import * as fs from "fs";
import IExcelObjectModel from "../models/IExcelObjectModel";

export const excelReader = (fileName: string): Promise<IExcelObjectModel[]> => {
  return new Promise((resolve) => {
    try {
      console.log(`Reading ${fileName}.xlsx...`);
      const excelObject: IExcelObjectModel[] = xlsx.parse(
        fs.readFileSync(`./testFiles/${fileName}.xlsx`)
      );
      resolve(excelObject);
    } catch (err) {
      throw new Error(`An error occured during file reading: ${err.message}`);
    }
  });
};
