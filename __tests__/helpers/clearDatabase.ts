import { postgresClient } from "../../src/config/connect-db"

export async function clearDatabase() {
  await postgresClient.query('TRUNCATE TABLE article_event CASCADE');
  await postgresClient.query('TRUNCATE TABLE article_launch CASCADE');
  await postgresClient.query('TRUNCATE TABLE articles CASCADE');
  await postgresClient.query('TRUNCATE TABLE events CASCADE');
  await postgresClient.query('TRUNCATE TABLE launches CASCADE');
}