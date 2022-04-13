import { EnvType } from "../models/EnvType.enum";

const dBM = require("db-migrate");

export const resetDBWords = async (env: EnvType): Promise<void> => {
  try {
    const dbm = dBM.getInstance(true, { env: env });
    await dbm.down(3);
    await dbm.up(3);
  } catch (error) {
    throw error;
  }
};
