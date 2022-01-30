import xlsx from "node-xlsx";
import * as fs from "fs";
import IExcelObjectModel from "../models/IExcelObjectModel";

export const excelReader = (fileName: string): IExcelObjectModel[] => {
  try {
    console.log(`Reading ${fileName}.xlsx...`);
    const excelObject: IExcelObjectModel[] = xlsx.parse(
      fs.readFileSync(`./testFiles/${fileName}.xlsx`)
    );
    console.log(`Reading ${fileName}.xlsx is finished.`);
    return excelObject;
  } catch (error) {
    throw new Error(`An error occured during file reading: ${error.message}`);
  }
};
