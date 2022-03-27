const dBM = require("db-migrate");

export const resetWords = async (): Promise<void> => {
  try {
    const dbm = dBM.getInstance(true);
    await dbm.down(3);
    await dbm.up(3);
  } catch (error) {
    throw error;
  }
};
