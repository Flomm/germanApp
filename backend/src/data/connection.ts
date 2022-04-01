import mysql from 'mysql';
import config from '../config';

const databaseConnection = mysql.createPool({
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
});

export const db = {
  async usePooledConnectionAsync(): Promise<mysql.PoolConnection> {
    return await new Promise((resolve, reject) => {
      databaseConnection.getConnection((error, connection) => {
        if (error) {
          reject(error);
        } else {
          resolve(connection);
        }
      });
    });
  },

  async query<T>(query: string, values: (string | number)[]): Promise<T> {
    return new Promise<T>(async (resolve, reject) => {
      const connection = await db.usePooledConnectionAsync();
      connection.query(query, values, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        connection.release();
        resolve(JSON.parse(JSON.stringify(result)));
      });
    });
  },
};
