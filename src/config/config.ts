import dotenv from "dotenv";

dotenv.config();

export const config = {
  mongoUser: process.env.MONGO_USER,
  mongoPassword: process.env.MONGO_PASSWORD,
  mongoDatabase: process.env.MONGO_DATABASE,
  mongoHost: process.env.MONGO_HOST,
  gmailEmail: process.env.GMAIL_EMAIL,
  gmailPassword: process.env.GMAIL_PASSWORD,
  port: process.env.PORT || 8080,
};