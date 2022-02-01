const dBM = require("db-migrate");

export const resetDB = (): Promise<void> => {
  const dbm = dBM.getInstance(true);
  return dbm
    .reset()
    .then(() => dbm.up().catch((error: unknown) => Promise.reject(error)))
    .catch((error: unknown) => Promise.reject(error));
};
