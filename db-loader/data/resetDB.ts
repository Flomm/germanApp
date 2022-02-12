const dBM = require("db-migrate");

export const resetDB = (): Promise<void> => {
  const dbm = dBM.getInstance(true);
  return dbm
    .reset()
    .then(() => dbm.up().catch((err: Error) => Promise.reject(err)))
    .catch((err: Error) => Promise.reject(err));
};
