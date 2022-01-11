import { postgresClient } from "../config/connect-db";
import { DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_PAGE } from "../constants/defaults";
import { ILaunch } from "../typings/launch.interface";

export default class LaunchModel {
  static async has(id: string) {
    const result = await postgresClient.query('SELECT FROM launches WHERE id = $1', [id]);
    return !!result.rowCount;
  }

  static async get(id: string) {
    const result = await postgresClient.query('SELECT * FROM launches WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async getMany(limit?: number, page?: number) {
    const finalLimit = limit || DEFAULT_PAGINATION_LIMIT;
    const skipCount = ((page || DEFAULT_PAGINATION_PAGE) - 1) * finalLimit;

    const result = await postgresClient.query('SELECT * FROM launches LIMIT $1 OFFSET $2', [finalLimit, skipCount]);
    return result.rows;
  }

  static async create(launch: ILaunch) {
    const result = await postgresClient.query(`
        INSERT INTO launches(
          ${launch.id ? 'id,' : ''}
          provider
        ) VALUES (${launch.id ? '$2,' : ''} $1)
        RETURNING *
      `, [
        launch.provider,
        ...(launch.id ? [launch.id] : [])
      ]);
    
    return result.rows[0];
  }

  static async update(id: string, launch: Omit<ILaunch, 'id'>) {
    await postgresClient.query(
      `
        UPDATE launches SET 
          provider = $2
        WHERE id = $1
      `, [
        id,
        launch.provider,
      ]
    );
  }

  static async delete(id: string) {
    await postgresClient.query('DELETE FROM launches WHERE id = $1', [id]);
  }
}