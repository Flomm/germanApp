import { resolve } from "path";
import { createConnection, db } from "../data/connection";
import { EnvType } from "../models/EnvType.enum";
import IAddWordDataModel from "../models/IAddWordDataModel";
import IExcelObjectModel from "../models/IExcelObjectModel";
import { wordRepository } from "./addWordRepo";
import { excelReader } from "./excelReader";
import { rowToObjectTransformer } from "./rowToObjectTransformer";
import { sleep } from "./sleep";

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
    for (let i = 0; i < wordObjectList.length; i++) {
      if (wordObjectList[i].length > 0) {
        console.log(`Start loading of topic nr. ${i + 1}.`);
        createConnection(env);
        await db.checkConnection();
        for (const wordObj of wordObjectList[i]) {
          await wordRepository.addNewWordEntry(language, wordObj, env);
        }
        db.disconnect();
        console.log(
          `Topic nr. ${
            i + 1
          } has been succesfully loaded. Going to sleep for one hour.`
        );
        await sleep(5000);
      }
    }
    resolve;
  } catch (err) {
    throw err;
  }
};
