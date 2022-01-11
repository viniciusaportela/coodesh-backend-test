import express from "express";
import cron from 'node-cron'

import { envConfig } from './config/env'
import { syncArticlesFromApi } from "./scripts/sync-article-from-api";
import { connectDb } from "./config/connect-db";
import { setupSwagger } from "./config/swagger";
import { setupMiddlewares } from "./config/setupMiddlewares";

export async function configureCron() {
  cron.schedule('0 9 * * * *', syncArticlesFromApi);
}

export async function initServer() {
  try {
    if (envConfig.cronActive) configureCron();

    await connectDb();

    const app = express();

    await setupSwagger(app);
    setupMiddlewares(app);

    const port = envConfig.port
    
    return app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  } catch(error) {
    console.error("Error when trying to start server: ", error)
  }
}

initServer();