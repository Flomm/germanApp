import mysql from "mysql";
import dbConfig from "./dbConfig";

const databaseConnection = mysql.createConnection({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
});

export const db = {
  checkConnection(): Promise<void> {
    return new Promise((resolve, reject) => {
      databaseConnection.connect((err) => {
        if (err) {
          console.error("Cannot connect to the database", err);
          return reject(err);
        }
        console.log("Database Connection is OK");
        resolve();
      });
    });
  },
  query<T>(query: string, values: (string | number)[]): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      databaseConnection.query(query, values, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(JSON.parse(JSON.stringify(result)));
      });
    });
  },
  disconnect(): void {
    databaseConnection.end();
  },
};
