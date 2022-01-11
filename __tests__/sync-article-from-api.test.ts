import { Express } from 'express';
import fetch from 'node-fetch';
import { postgresClient } from '../src/config/connect-db';
import { envConfig } from '../src/config/env';
import { clearDatabase } from './helpers/clearDatabase';
import { setupTest } from './helpers/setupTest';
import spaceNewsApiMock from './mocks/spaceNewsApi.mock.json'
import { syncArticlesFromApi } from '../src/scripts/sync-article-from-api/sync-article-from-api';
import MailService from '../src/services/mail.service';
import ArticleModel from '../src/models/article.model';
import { getLastPageFromCache } from '../src/scripts/sync-article-from-api/sync-article-from-api-cache';

jest.mock('node-fetch');
jest.mock('../src/services/mail.service');
jest.mock('../src/scripts/sync-article-from-api/sync-article-from-api-cache.ts');

beforeAll(async () => {
  await setupTest();
});

beforeEach(async () => {
  await clearDatabase();

  fetch.mockImplementation((url: string) => {
    if (url === `${envConfig.syncFetchApi}/articles/count`) {
      return {
        text() {
          return '10';
        }
      };
    } else {
      return {
        json() {
          return spaceNewsApiMock;
        }
      }
    }
  });

  (getLastPageFromCache as any).mockResolvedValue(-1)
});

afterAll(async () => {
  await postgresClient.end();
});

describe('syncArticleFromApi script', () => {
  it('should add missing articles and not duplicate', async () => {
    await syncArticlesFromApi();
    await syncArticlesFromApi();

    const articles = await ArticleModel.getMany(10, 1);
    expect(articles).toHaveLength(10);
  });

  it('should send a email when an error occurs', async () => {
    fetch.mockImplementation(() => {
      throw new Error();
    })
    const mailSpy = jest.spyOn(MailService, 'send');
    (MailService.send as any).mockResolvedValue(true);

    await syncArticlesFromApi();

    expect(mailSpy).toBeCalled();
  });
});