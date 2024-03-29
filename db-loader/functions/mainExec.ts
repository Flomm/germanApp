import { db } from "../data/connection";
import { resetDB } from "../data/resetDB";
import { dbLoader } from "./dbLoader";
import { resetDBWords } from "../data/resetDBWords";
import { EnvType } from "../models/EnvType.enum";

export const mainExec = async (
  fileNames: string[],
  isInitial: boolean,
  env: EnvType
): Promise<void> => {
  try {
    console.log("Starting main process...");
    if (isInitial) {
      await resetDB(env);
    } else {
      await resetDBWords(env);
    }
    console.warn("Database have been reseted.");
    await dbLoader(fileNames[0], "hu", env);
    await dbLoader(fileNames[1], "de", env);
    console.log("Main process has been finished.");
  } catch (err) {
    console.warn(err);
    console.log("Closing connection due to error");
    db.disconnect();
  }
};
