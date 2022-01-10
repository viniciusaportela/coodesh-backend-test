import express from "express";
import bodyParser from "body-parser";
import cron from 'node-cron'
import cors from "cors";

import Routes from "./routes";

import { envConfig } from './config/env'
import { handleErrors } from "./middlewares/handle-errors.middleware";
import { syncArticlesFromApi } from "./scripts/sync-article-from-api";
import { connectDb } from "./config/connect-db";
import { setupSwagger } from "./config/swagger";

async function configureCron() {
  cron.schedule('0 9 * * * *', syncArticlesFromApi);
}

function setupMiddlewares(app: express.Express) {
  app.use(bodyParser.json());
  app.use(cors());
  app.use(Routes);
  app.use(handleErrors);
}

async function initServer() {
  try {
    if (envConfig.cronActive) configureCron();

    await connectDb();

    const app = express();

    await setupSwagger(app);
    setupMiddlewares(app);

    app.listen(envConfig.port, () => {
      console.log(`Server is running on port: ${envConfig.port}`);
    });
  } catch(error) {
    console.error("Error when trying to start server: ", error)
  }
}

initServer();