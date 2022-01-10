import { postgresClient } from "../config/connect-db";
import { IEvent } from "../typings/event.interface";

export default class EventModel {
  static async has(id: number) {
    const result = await postgresClient.query('SELECT FROM events WHERE id = $1', [id]);
    return !!result.rowCount;
  }

  static async get(id: number) {
    const result = await postgresClient.query('SELECT * FROM events WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async create(event: IEvent) {
    const result = await postgresClient.query(`
        INSERT INTO events(
          ${event.id ? 'id,' : ''}
          provider
        ) VALUES (${event.id ? '$2,' : ''} $1)
        RETURNING *
      `, [
        event.provider,
        ...(event.id ? [event.id] : [])
      ]);
    
    return result.rows[0];
  }

  static async update(id: number, event: Omit<IEvent, 'id'>) {
    await postgresClient.query(
      `
        UPDATE events SET 
          provider = $2
        WHERE id = $1
      `, [
        id,
        event.provider,
      ]
    );
  }

  static async delete(id: number) {
    await postgresClient.query('DELETE FROM events WHERE id = $1', [id]);
  }
}