import IAddWordDataModel from "../models/IAddWordDataModel";
import IExcelObjectModel from "../models/IExcelObjectModel";
import ITranslationDataModel from "../models/ITranslationDataModel";

export const rowToObjectTransformer = (
  excelObjectArray: IExcelObjectModel[],
  language: string
): Promise<IAddWordDataModel[][]> => {
  return new Promise((resolve) => {
    console.log("Transforming rows to objects...");
    try {
      const wordObjectsListByTopic: IAddWordDataModel[][] = [];
      excelObjectArray.forEach((excelObject, i) => {
        console.log(`Transformation began for ${excelObject.name}`);
        const dataArray: unknown[][] = excelObject.data as unknown[][];
        if (language === "hu") {
          wordObjectsListByTopic[i] = dataArray.map((val) => {
            const translations: ITranslationDataModel[] = [];
            if ((val[2] as string).includes("_")) {
              let articleList: string[];
              if (val[1]) {
                articleList = (val[1] as string).split("_");
              }
              (val[2] as string).split("_").forEach((word, i) => {
                const newTranslation: ITranslationDataModel = {
                  translation: word,
                };
                if (articleList) {
                  newTranslation.gender = articleList[i];
                }
                translations.push(newTranslation);
              });
            } else {
              translations.push({ translation: val[2] as string });
              if (val[1]) {
                translations[0].gender = val[1] as string;
              }
            }
            return {
              word: val[0] as string,
              topic: i + 1,
              translations,
            };
          });
        } else {
          wordObjectsListByTopic[i] = dataArray.map((val) => {
            let translations: ITranslationDataModel[];
            if ((val[2] as string).includes("_")) {
              translations = (val[2] as string).split("_").map((val) => {
                return {
                  translation: val,
                };
              });
            } else {
              translations = [{ translation: val[2] as string }];
            }

            const wordObject: IAddWordDataModel = {
              word: val[0] as string,
              topic: i + 1,
              translations,
            };

            if (val[1]) {
              wordObject.gender = val[1] as string;
            }
            return wordObject;
          });
        }
        console.log(`Transformation has been finished for ${excelObject.name}`);
      });
      console.log("Transformation is finished.");
      resolve(wordObjectsListByTopic);
    } catch (err) {
      throw new Error(`An error occured during transformation: ${err.message}`);
    }
  });
};
