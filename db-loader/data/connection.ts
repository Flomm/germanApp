import mysql from "mysql";
import { EnvType } from "../models/EnvType.enum";
import dbConfig from "./dbConfig";

let databaseConnection: mysql.Connection;

export const createConnection = (env: EnvType): void => {
  if (env === EnvType.DEV) {
    databaseConnection = mysql.createConnection({
      host: dbConfig.dev.host,
      user: dbConfig.dev.user,
      password: dbConfig.dev.password,
      database: dbConfig.dev.database,
    });
  } else {
    databaseConnection = mysql.createConnection({
      host: dbConfig.prod.host,
      user: dbConfig.prod.user,
      password: dbConfig.prod.password,
      database: dbConfig.prod.database,
    });
  }
  console.warn(databaseConnection);
};

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
