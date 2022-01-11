import dotenv from "dotenv";

dotenv.config();

export const envConfig = {
  syncFetchApi: process.env.SYNC_FETCH_API,
  cronActive: process.env.CRON_ACTIVE === 'true',
  gmailSenderEmail: process.env.GMAIL_SENDER_EMAIL,
  gmailSenderPassword: process.env.GMAIL_SENDER_PASSWORD,
  reportReceiverEmail: process.env.REPORT_RECEIVER_EMAIL,
  postgresHost: process.env.POSTGRES_HOST,
  postgresDatabase: process.env.POSTGRES_DATABASE,
  postgresPort: process.env.POSTGRES_PORT,
  postgresUser: process.env.POSTGRES_USER,
  postgresPassword: process.env.POSTGRES_PASSWORD,
  testPostgresHost: process.env.TEST_POSTGRES_HOST,
  testPostgresDatabase: process.env.TEST_POSTGRES_DATABASE,
  testPostgresPort: process.env.TEST_POSTGRES_PORT,
  testPostgresUser: process.env.TEST_POSTGRES_USER,
  testPostgresPassword: process.env.TEST_POSTGRES_PASSWORD,
  testPort: process.env.TEST_PORT,
  port: process.env.PORT || 8080,
  swaggerApiServer: process.env.SWAGGER_API_SERVER,

  production: process.env.NODE_ENV === 'production',
  test: process.env.NODE_ENV === 'test'
};