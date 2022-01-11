import pg from 'pg'
import { envConfig } from './env';

export let postgresClient: pg.Client;

export function connectDb() {
  return new Promise((resolve, reject) => {
    const uri = `postgres://${envConfig.postgresUser}:${envConfig.postgresPassword}@${envConfig.postgresHost}:${envConfig.postgresPort}/${envConfig.postgresDatabase}`

    const testUri = `postgres://${envConfig.testPostgresUser}:${envConfig.testPostgresPassword}@${envConfig.testPostgresHost}:${envConfig.testPostgresPort}/${envConfig.testPostgresDatabase}`

    postgresClient = new pg.Client({
      connectionString: envConfig.test ? testUri : uri,
      ...(envConfig.production && { ssl: {
        rejectUnauthorized: false
      }})
    });

    postgresClient.connect(err => {
      if (err) reject(err)
      resolve(true);
    })
  })
}