import pg from 'pg'
import { config } from './config';

export let postgresClient: pg.Client;

export function connectDb() {
  return new Promise((resolve, reject) => {
    postgresClient = new pg.Client(`postgres://${config.postgresUser}:${config.postgresPassword}@${config.postgresHost}:${config.postgresPort}/${config.postgresDatabase}`);
    postgresClient.connect(err => {
      if (err) reject()
      resolve(true);
    })
  })
}