import pg from 'pg'
import { envConfig } from './env';

export let postgresClient: pg.Client;

export function connectDb() {
  return new Promise((resolve, reject) => {
    postgresClient = new pg.Client(`postgres://${envConfig.postgresUser}:${envConfig.postgresPassword}@${envConfig.postgresHost}:${envConfig.postgresPort}/${envConfig.postgresDatabase}`);
    postgresClient.connect(err => {
      if (err) reject()
      resolve(true);
    })
  })
}