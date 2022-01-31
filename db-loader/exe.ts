import { db } from "./data/connection";
import { dbLoader } from "./functions/dbLoader";

db.checkConnection()
  .then(() => {
    dbLoader("main_hu", "hu");
    dbLoader("main_de", "de");
  })
  .catch((err) => {
    console.log(err.message);
    db.disconnect();
  });
