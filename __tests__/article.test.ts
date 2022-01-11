import { Express } from 'express';
import { postgresClient } from "../src/config/connect-db";
import { clearDatabase } from './helpers/clearDatabase';
import { setupTest } from './helpers/setupTest';

let app: Express;
beforeAll(async () => {
  app = await setupTest();
});

beforeEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await postgresClient.end();
})

describe('Articles Suite Case', () => {
  describe("POST /articles", () => {
    it('should fail with validation-error error', () => {
      
    })

    it('should successfully create an article without events and launches', () => {
      
    })
  
    it('should successfully create article', () => {
      
    })
  })
})