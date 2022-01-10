import { postgresClient } from "../config/connectDb";
import { AlreadyExistsError } from "../errors/AlreadyExists";
import { NotFoundError } from "../errors/NotFound";
import ArticleService from "./article.service";

export default class LaunchService {
  static getQuery = 'SELECT * FROM launches WHERE id = $1';

  static async has(launchId: string) {
    const launch = await postgresClient.query(LaunchService.getQuery, [launchId]);
    return !!launch.rowCount;
  }

  static async get(launchId: string) {
    const launch = await postgresClient.query(LaunchService.getQuery, [launchId]);

    if (launch.rowCount) {
      return launch.rows[0];
    } else {
      throw new NotFoundError();
    }
  }

  static async create(provider: string, launchId?: string) {
    let isLaunchInDb = false
    if (launchId) {
      isLaunchInDb = await this.has(launchId);
    }

    if (!isLaunchInDb) {
      const inserted = await postgresClient.query(`
        INSERT INTO launches(
          id,
          provider
        ) VALUES ($1, $2)
      `, [
        launchId,
        provider
      ]);

      return inserted.rows;
    } else {
      throw new AlreadyExistsError();
    }
  }

  static async update(launchId: string, provider: string) {
    const isLaunchInDb = await this.has(launchId);

    if (!isLaunchInDb) {
      throw new NotFoundError();
    }

    await postgresClient.query(
      `
        UPDATE launches SET 
          provider = $2,
        WHERE id = $1
      `, [
        launchId,
        provider,
      ]
    );
  }

  static async delete(launchId: string) {
    const isLaunchInDb = await this.has(launchId);

    if (!isLaunchInDb) {
      throw new NotFoundError();
    }

    await postgresClient.query('DELETE FROM launches WHERE id = $1', [launchId]);
  }

  static async insertToArticle(launchId: string, articleId: number) {
    const articleExists = ArticleService.has(articleId);

    if (!articleExists) {
      throw new NotFoundError("this article doesn't exists");
    }

    const launchExists = LaunchService.has(launchId)
    if (!launchExists) {
      throw new NotFoundError("this launch doesn't exists");
    }

    await postgresClient.query(`
      INSERT INTO article_launch(
        launch_id,
        article_id
      ) VALUES ($1, $2)
    `, [launchId, articleId])
  }
}