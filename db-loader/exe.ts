import { db } from "./data/connection";
import { dbLoader } from "./functions/dbLoader";

db.checkConnection().then(() => {
  // dbLoader("main_hu", "hu").catch((err) => Promise.reject(err));
  dbLoader("main_de2q2e", "de")
    .then((_) => {
      console.log("Closing connection");
      db.disconnect();
    })
    .catch((err) => {
      console.warn(err.message);
      console.log("Closing connection due to error");
      db.disconnect();
    });
});
