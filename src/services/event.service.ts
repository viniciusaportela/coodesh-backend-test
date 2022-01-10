import { postgresClient } from "../config/connectDb";
import { AlreadyExistsError } from "../errors/AlreadyExists";
import { NotFoundError } from "../errors/NotFound";
import ArticleService from "./article.service";

export default class EventService {
  static getQuery = 'SELECT * FROM events WHERE id = $1';

  static async has(eventId: string) {
    const event = await postgresClient.query(EventService.getQuery, [eventId]);
    return !!event.rowCount;
  }

  static async get(eventId: string) {
    const event = await postgresClient.query(EventService.getQuery, [eventId]);

    if (event.rowCount) {
      return event.rows[0];
    } else {
      throw new NotFoundError();
    }
  }

  static async create(provider: string, eventId?: string) {
    let isEventInDb = false
    if (eventId) {
      isEventInDb = await this.has(eventId);
    }

    if (!isEventInDb) {
      const inserted = await postgresClient.query(`
        INSERT INTO events(
          ${eventId ? 'id,' : ''}
          provider
        ) VALUES (${eventId ? '$2,' : ''} $1)
        RETURNING *
      `, [
        provider,
        ...(eventId ? [eventId] : [])
      ]);

      return inserted.rows;
    } else {
      throw new AlreadyExistsError();
    }
  }

  static async update(eventId: string, provider: string) {
    const eventInDb = await EventService.has(eventId);

    if (!eventInDb) {
      throw new NotFoundError();
    }

    await postgresClient.query(
      `
        UPDATE events SET 
          provider = $2
        WHERE id = $1
      `, [
        eventId,
        provider,
      ]
    );
  }

  static async delete(eventId: string) {
    const eventInDb = await EventService.has(eventId);

    if (!eventInDb) {
      throw new NotFoundError();
    }

    await postgresClient.query('DELETE FROM events WHERE id = $1', [eventId]);
  }

  static async insertToArticle(eventId: string, articleId: number) {
    const articleExists = ArticleService.has(articleId);

    if (!articleExists) {
      throw new NotFoundError("this article doesn't exists");
    }

    const eventExists = EventService.has(eventId)
    if (!eventExists) {
      throw new NotFoundError("this event doesn't exists");
    }

    await postgresClient.query(`
      INSERT INTO article_event(
        event_id,
        article_id
      ) VALUES ($1, $2)
    `, [eventId, articleId])
  }

  static async removeArticle() {
    
  }
}