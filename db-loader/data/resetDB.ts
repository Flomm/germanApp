import { EnvType } from "../models/EnvType.enum";

const dBM = require("db-migrate");

export const resetDB = (env: EnvType): Promise<void> => {
  const dbm = dBM.getInstance(true, { env: env });
  return dbm
    .reset()
    .then(() => dbm.up().catch((err: Error) => Promise.reject(err)))
    .catch((err: Error) => Promise.reject(err));
};
