import express from 'express';
import { readFile } from 'fs/promises';
import { join } from 'path';
import swaggerUi from "swagger-ui-express";

export async function setupSwagger(app: express.Express) {
  const swaggerJsonFile = await readFile(join(__dirname, '../../swagger.json'), 'utf-8')
  const swaggerJson = JSON.parse(swaggerJsonFile);

  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerJson)
  );
}