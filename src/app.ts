import express from "express";
import bodyParser from "body-parser";
import cron from 'node-cron'
import cors from "cors";

import Routes from "./routes";

import { config } from './config/config'
import { handleErrors } from "./middlewares/handleErrors.middleware";
import { syncArticlesWithApi } from "./scripts/syncArticlesWithApi";
import { connectDb } from "./config/connectDb";

async function configureCron() {
  cron.schedule('0 9 * * * *', syncArticlesWithApi);
}

function setupMiddlewares(app: express.Express) {
  app.use(bodyParser.json());
  app.use(cors());
  app.use(Routes);
  app.use(handleErrors);
}

async function initServer() {
  try {
    configureCron();

    await connectDb();

    const app = express();

    setupMiddlewares(app);
  
    app.listen(config.port, () => {
      console.log(`Server is running on port: ${config.port}`);
    });
  } catch(error) {
    console.error("Error when trying to start server: ", error)
  }
}

initServer();