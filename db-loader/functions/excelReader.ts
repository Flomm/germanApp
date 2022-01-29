import xlsx from "node-xlsx";
import * as fs from "fs";
import IExcelObjectModel from "../models/IExcelObjectModel";

export const excelReader = (fileName: string): IExcelObjectModel[] => {
  try {
    const excelObject: IExcelObjectModel[] = xlsx.parse(
      fs.readFileSync(`./testFiles/${fileName}.xlsx`)
    );
    return excelObject;
  } catch (error) {
    console.log(`An error occured: ${error.message}`);
  }
};
