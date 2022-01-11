import { Express } from 'express';
import request from 'supertest'
import { postgresClient } from '../src/config/connect-db';
import { ErrorCodes } from '../src/constants/error-codes';
import LaunchModel from '../src/models/launch.model';
import { clearDatabase } from './helpers/clearDatabase';
import { setupTest } from './helpers/setupTest';
import { launchMock, launchUpdatedMock } from './mocks/launch.mock';

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

describe('Launches Suite Case', () => {
  describe('GET /launches', () => {
    it('should successfully return a list of launches', async () => {
      await LaunchModel.create(launchMock);

      const response = await request(app).get('/launches');

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual([launchMock]);
    });

    it('should return a list of launches limited by 1 launch', async () => {
      await LaunchModel.create(launchMock);
      await LaunchModel.create({ ...launchMock, id: 'cabcd39f-2093-4b66-839a-192d81d761de' });

      const response = await request(app).get('/launches').query({ limit: 1 });

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual([launchMock]);
    });

    it('should return a list of launches limited by 1 launch and skip 1 launch', async () => {
      await LaunchModel.create(launchMock);
      await LaunchModel.create({ ...launchMock, id: 'cabcd39f-2093-4b66-839a-192d81d761de' });

      const response = await request(app).get('/launches').query({ limit: 1, page: 2 });

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual([{ ...launchMock, id: 'cabcd39f-2093-4b66-839a-192d81d761de' }]);
    });
  })

  describe('POST /launches', () => {
    it('should return an validation-error error', async () => {
      const response = await request(app).post('/launches');
      expect(response.body.error).toBe(ErrorCodes.VALIDATION_ERROR);
    });

    it('should successfully create an launch', async () => {
      const response = await request(app).post('/launches').send(launchMock);
      expect(response.status).toBe(201);
    });
  })

  describe('GET /launches/:launchId', () => {
    it('should successfully return an launch', async () => {
      await LaunchModel.create(launchMock);

      const response = await request(app).get(`/launches/${launchMock.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(launchMock);
    });
  })

  describe('PUT /launches/:launchId', () => {
    it('should return an validation-error error', async () => {
      const response = await request(app).put(`/launches/${launchMock.id}`);
      expect(response.body.error).toBe(ErrorCodes.VALIDATION_ERROR);
    });

    it("should return an error when the launch doesn't exists", async () => {
      const response = await request(app).put(`/launches/${launchMock.id}`).send(launchMock);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe(ErrorCodes.NOT_FOUND);
    })

    it('should update a launch', async () => {
      await LaunchModel.create(launchMock);

      const response = await request(app).put(`/launches/${launchMock.id}`).send({ provider: launchUpdatedMock.provider });

      expect(response.status).toBe(200);

      const launch = await LaunchModel.get(launchMock.id);
      expect(launch).toStrictEqual(launchUpdatedMock);
    })
  })

  describe('DELETE /launches/:launchId', () => {
    it("should return an error when the launch doesn't exists", async () => {
      const response = await request(app).delete(`/launches/${launchMock.id}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe(ErrorCodes.NOT_FOUND);
    })

    it('should delete an launch', async () => {
      await LaunchModel.create(launchMock);

      const response = await request(app).delete(`/launches/${launchMock.id}`);

      expect(response.status).toBe(200);

      const launch = await LaunchModel.get(launchMock.id);
      expect(launch).toBeUndefined();
    })
  })
})