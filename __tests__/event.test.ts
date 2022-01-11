import { Express } from 'express';
import request from 'supertest'
import { postgresClient } from '../src/config/connect-db';
import { ErrorCodes } from '../src/constants/error-codes';
import EventModel from '../src/models/event.model';
import { clearDatabase } from './helpers/clearDatabase';
import { setupTest } from './helpers/setupTest';
import { eventMock, eventUpdatedMock } from './mocks/event.mock';

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

describe('Events Suite Case', () => {
  describe('GET /events', () => {
    it('should successfully return a list of events', async () => {
      await EventModel.create(eventMock);

      const response = await request(app).get('/events');

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual([eventMock]);
    });
  })

  describe('POST /events', () => {
    it('should return an validation-error error', async () => {
      const response = await request(app).post('/events');
      expect(response.body.error).toBe(ErrorCodes.VALIDATION_ERROR);
    });

    it('should successfully create an event', async () => {
      const response = await request(app).post('/events').send(eventMock);
      expect(response.status).toBe(201);
    });
  })

  describe('GET /events/:eventId', () => {
    it('should successfully return an event', async () => {
      await EventModel.create(eventMock);

      const response = await request(app).get(`/events/${eventMock.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(eventMock);
    });
  })

  describe('PUT /events/:eventId', () => {
    it('should return an validation-error error', async () => {
      const response = await request(app).put('/events/2');
      expect(response.body.error).toBe(ErrorCodes.VALIDATION_ERROR);
    });

    it("should return an error when the event doesn't exists", async () => {
      const response = await request(app).put('/events/2').send(eventMock);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe(ErrorCodes.NOT_FOUND);
    })

    it('should update an event', async () => {
      await EventModel.create(eventMock);

      const response = await request(app).put(`/events/${eventMock.id}`).send({ provider: eventUpdatedMock.provider });

      expect(response.status).toBe(200);

      const event = await EventModel.get(eventMock.id);
      expect(event).toStrictEqual(eventUpdatedMock);
    })
  })

  describe('DELETE /events/:eventId', () => {
    it("should return an error when the event doesn't exists", async () => {
      const response = await request(app).delete('/events/1');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe(ErrorCodes.NOT_FOUND);
    })

    it('should delete an event', async () => {
      await EventModel.create(eventMock);

      const response = await request(app).delete(`/events/${eventMock.id}`);

      expect(response.status).toBe(200);

      const event = await EventModel.get(eventMock.id);
      expect(event).toBeUndefined();
    })
  })
})