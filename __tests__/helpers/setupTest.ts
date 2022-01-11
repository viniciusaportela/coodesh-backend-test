import express from 'express';
import { connectDb } from "../../src/config/connect-db";
import { setupMiddlewares } from '../../src/config/setupMiddlewares';

export async function setupTest() {
  await connectDb();
  const app = express();
  setupMiddlewares(app);
  return app;
}