import pg from 'pg'
import { envConfig } from './env';

export let postgresClient: pg.Client;

export function connectDb() {
  return new Promise((resolve, reject) => {
    console.log(`postgres://${envConfig.postgresUser}:${envConfig.postgresPassword}@${envConfig.postgresHost}:${envConfig.postgresPort}/${envConfig.postgresDatabase}`);
    postgresClient = new pg.Client({
      connectionString: `postgres://${envConfig.postgresUser}:${envConfig.postgresPassword}@${envConfig.postgresHost}:${envConfig.postgresPort}/${envConfig.postgresDatabase}`,
      ...(envConfig.production && { ssl: {
        rejectUnauthorized: false
      }})
    });
    postgresClient.connect(err => {
      if (err) reject()
      resolve(true);
    })
  })
}