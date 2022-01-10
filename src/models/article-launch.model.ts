import { postgresClient } from "../config/connect-db";

export default class ArticleLaunchModel {
  static async create(launchId: string, articleId: number) {
    await postgresClient.query(`
        INSERT INTO article_launch(
          launch_id,
          article_id
        ) VALUES ($1, $2)
      `, [launchId, articleId]) 
  }

  static async delete(launchId: string, articleId: number) {
    await postgresClient.query(`
      DELETE FROM article_launch WHERE launch_id = $1 AND article_id = $2
    `, [launchId, articleId]) 
  }
}