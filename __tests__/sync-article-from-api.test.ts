import { Express } from 'express';
import { postgresClient } from '../src/config/connect-db';
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

describe('syncArticleFromApi script', () => {
  it('should add missing articles', () => {
    
  });

  it('should send a email when an error occurs', () => {
    
  });
});