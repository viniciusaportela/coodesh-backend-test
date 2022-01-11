import { Express } from 'express';
import { handleErrors } from "../middlewares/handle-errors.middleware";
import cors from "cors";
import bodyParser from "body-parser";
import Routes from "../routes";

export function setupMiddlewares(app: Express) {
  app.use(bodyParser.json());
  app.use(cors());
  app.use(Routes);
  app.use(handleErrors);
}