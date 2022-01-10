import express from 'express';
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from 'swagger-jsdoc';

export function setupSwagger(app: express.Express) {
  const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      description: "Space Flight Articles API, based on Spaceflight News API",
      title: 'Space Flight Articles',
      version: '1.0.0',
    },
  };

  const options = {
    swaggerDefinition,
    apis: [
      './src/routes/article.route.ts', 
      './src/routes/event.route.ts', 
      './src/routes/launch.route.ts', 
      './src/routes/root.route.ts'
    ],
  };

  const swaggerSpec = swaggerJSDoc(options);

  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
  );
}