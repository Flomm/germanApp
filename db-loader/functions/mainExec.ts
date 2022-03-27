import { db } from "../data/connection";
import { resetDB } from "../data/resetDB";
import { dbLoader } from "./dbLoader";
import { resetDBWords } from "./resetDBWords";

export const mainExec = async (
  fileNames: string[],
  isInitial: boolean
): Promise<void> => {
  try {
    await db.checkConnection();
    console.log("Starting main process...");
    if (isInitial) {
      await resetDB();
    } else {
      await resetDBWords();
    }
    console.warn("Database have been reseted.");
    await dbLoader(fileNames[0], "hu");
    await dbLoader(fileNames[1], "de");
    console.log("Main process has been finished.");
    console.log("Closing connection");
    db.disconnect();
  } catch (err) {
    console.warn(err);
    console.log("Closing connection due to error");
    db.disconnect();
  }
};
