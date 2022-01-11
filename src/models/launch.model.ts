import { postgresClient } from "../config/connect-db";
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

  static async getMany() {
    const result = await postgresClient.query('SELECT * FROM launches');
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