import { db } from "../data/connection";
import { resetDB } from "../data/resetDB";
import { dbLoader } from "./dbLoader";

export const mainExec = async (fileNames: string[]): Promise<void> => {
  try {
    await db.checkConnection();
    console.log("Starting main process...");
    await resetDB();
    console.warn("Database have been reseted.");
    await dbLoader(fileNames[0], "hu");
    await dbLoader(fileNames[1], "de");
    console.log("Main process has been finished.");
    console.log("Closing connection");
    db.disconnect();
  } catch (err) {
    console.warn(err?.message);
    console.log("Closing connection and resetting db due to error");
    db.disconnect();
  }
};
