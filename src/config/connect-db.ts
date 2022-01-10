import pg from 'pg'
import { env } from './env';

export let postgresClient: pg.Client;

export function connectDb() {
  return new Promise((resolve, reject) => {
    postgresClient = new pg.Client(`postgres://${env.postgresUser}:${env.postgresPassword}@${env.postgresHost}:${env.postgresPort}/${env.postgresDatabase}`);
    postgresClient.connect(err => {
      if (err) reject()
      resolve(true);
    })
  })
}