import mysql from 'mysql';
import config from '../config';

const databaseConnection = mysql.createConnection({
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database,
});

export const db = {
  checkConnection(): void {
    databaseConnection.connect(err => {
      if (err) {
        console.error('Cannot connect to the database', err);
        return;
      }
      console.log('Database Connection is OK');
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
};
