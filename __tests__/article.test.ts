import { Express } from 'express';
import request from 'supertest';
import { postgresClient } from "../src/config/connect-db";
import { ErrorCodes } from '../src/constants/error-codes';
import ArticleEventModel from '../src/models/article-event.model';
import ArticleLaunchModel from '../src/models/article-launch.model';
import ArticleModel from '../src/models/article.model';
import EventModel from '../src/models/event.model';
import LaunchModel from '../src/models/launch.model';
import ArticleService from '../src/services/article.service';
import { clearDatabase } from './helpers/clearDatabase';
import { setupTest } from './helpers/setupTest';
import {
  articleInputMock, 
  articleOutputMock, 
  articleUpdatedInputMock, 
  articleUpdatedDatabaseMock, 
  fullArticleInputMock, 
  fullArticleOutputMock 
} from './mocks/article.mock';

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
    it('should return an validation-error error', async () => {
      const response = await request(app).post('/articles');
      expect(response.body.error).toBe(ErrorCodes.VALIDATION_ERROR);
    });

    it('should successfully create an article without events and launches', async () => {
      const response = await request(app).post('/articles').send(articleInputMock);
      expect(response.status).toBe(201);
    });
  
    it('should successfully create an article', async () => {
      await EventModel.create({ id: 2, provider: 'provider' });
      await LaunchModel.create({ id: "c660df6f-7e33-4c90-a0f5-b27c8cb4c974", provider: 'provider' });

      const response = await request(app).post('/articles').send(fullArticleInputMock);
      expect(response.status).toBe(201);

      const articleEvent = await ArticleEventModel.get(fullArticleInputMock.events[0], fullArticleInputMock.id);
      expect(articleEvent).not.toBeUndefined();

      const articleLaunch = await ArticleLaunchModel.get(fullArticleInputMock.launches[0], fullArticleInputMock.id);
      expect(articleLaunch).not.toBeUndefined();
    });
  })

  describe('GET /articles', () => {
    it('should successfully return a list of articles', async () => {
      await ArticleModel.create(articleInputMock);

      const response = await request(app).get('/articles');

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual([articleOutputMock]);
    });

    it('should return a list of articles limited by 1 article', async () => {
      await ArticleModel.create(articleInputMock);
      await ArticleModel.create({ ...articleInputMock, id: 2 });

      const response = await request(app).get('/articles').query({ limit: 1 });

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual([articleOutputMock]);
    });

    it('should return a list of articles limited by 1 article and skip 1 article', async () => {
      await ArticleModel.create(articleInputMock);
      await ArticleModel.create({ ...articleInputMock, id: 2 });

      const response = await request(app).get('/articles').query({ limit: 1, page: 2 });

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual([{ ...articleOutputMock, id: 2 }]);
    });
  })

  describe('GET /articles/:articleId', () => {
    it("should return an error when the article doesn't exists", async () => {
      const response = await request(app).get('/articles/1');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe(ErrorCodes.NOT_FOUND);
    })

    it('should return an article', async () => {
      await ArticleModel.create(articleInputMock);

      const response = await request(app).get(`/articles/${articleInputMock.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(articleOutputMock);
    })

    it('should return an article with events and launches', async () => {
      await EventModel.create({ id: 2, provider: 'provider' });
      await LaunchModel.create({ id: "c660df6f-7e33-4c90-a0f5-b27c8cb4c974", provider: 'provider' });
      await ArticleService.create(fullArticleInputMock);

      const response = await request(app).get(`/articles/${fullArticleInputMock.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(fullArticleOutputMock);
    })
  })

  describe('PUT /articles/:articleId', () => {
    it("should return an error when the article doesn't exists", async () => {
      const response = await request(app).put('/articles/1').send(articleUpdatedInputMock);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe(ErrorCodes.NOT_FOUND);
    })

    it('should update an article', async () => {
      await ArticleModel.create(articleInputMock);

      const response = await request(app).put(`/articles/${articleInputMock.id}`).send(articleUpdatedInputMock);

      expect(response.status).toBe(200);

      const article = await ArticleModel.get(articleInputMock.id);
      expect(article).toStrictEqual(articleUpdatedDatabaseMock);
    })
  })

  describe('DELETE /articles/:articleId', () => {
    it("should return an error when the article doesn't exists", async () => {
      const response = await request(app).delete('/articles/1');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe(ErrorCodes.NOT_FOUND);
    })

    it('should delete an article', async () => {
      await ArticleModel.create(articleInputMock);

      const response = await request(app).delete(`/articles/${articleInputMock.id}`);

      expect(response.status).toBe(200);

      const article = await ArticleModel.get(articleInputMock.id);
      expect(article).toBeUndefined();
    })
  })
})