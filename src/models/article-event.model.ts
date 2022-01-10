import { postgresClient } from "../config/connect-db";

export default class ArticleEventModel {
  static async create(eventId: number, articleId: number) {
    await postgresClient.query(`
        INSERT INTO article_event(
          event_id,
          article_id
        ) VALUES ($1, $2)
      `, [eventId, articleId]) 
  }

  static async delete(eventId: number, articleId: number) {
    await postgresClient.query(`
      DELETE FROM article_event WHERE event_id = $1 AND article_id = $2
    `, [eventId, articleId]) 
  }
}