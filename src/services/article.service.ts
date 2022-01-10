import { DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_PAGE } from "../constants/defaults";
import { AlreadyExistsError } from "../errors/AlreadyExists";
import { NotFoundError } from "../errors/NotFound";
import { IArticle, IInputArticle } from "../typings/article.interface";
import { postgresClient } from "../config/connectDb";
import EventService from "./event.service";
import LaunchService from "./launch.service";

export default class ArticleService {
  static querySelectAliases = `
    id,
    featured,
    title,
    url,
    image_url AS "imageUrl",
    news_site AS "newSite",
    summary,
    published_at AS "publishedAt"
  `

  static getArticlesQuery = `
    SELECT
      ${ArticleService.querySelectAliases},
      coalesce(launches_table._launches, '{}') AS launches,
      coalesce(events_table._events, '{}') AS events
    FROM articles
    LEFT JOIN (
      SELECT _article_launch.article_id AS id,
      array_agg(
        row_to_json(launches)
      ) AS _launches
      FROM article_launch AS _article_launch
      JOIN launches ON launches.id = _article_launch.launch_id
      GROUP BY _article_launch.article_id
    ) as launches_table USING (id)
    LEFT JOIN (
      SELECT article_ev.article_id AS id,
      array_agg(
        row_to_json(events)
      ) AS _events
      FROM article_event AS article_ev
      JOIN events ON events.id = article_ev.event_id
      GROUP BY article_ev.article_id
    ) as events_table USING (id)
  `

  static getArticleByIdQuery = `
    ${ArticleService.getArticlesQuery} ORDER BY id WHERE id = $1
  `;

  static async list(limit?: number, page?: number): Promise<IArticle[]> {
    const articles = await postgresClient
      .query(
        `${ArticleService.getArticlesQuery} ORDER BY id LIMIT $1 OFFSET $2`,
        [limit || DEFAULT_PAGINATION_LIMIT, (page || DEFAULT_PAGINATION_PAGE) - 1]
      );

    return articles.rows;
  }

  static async has(articleId: number) {
    const article = await postgresClient.query('SELECT id FROM articles WHERE id = $1', [articleId]);
    return !!article.rowCount;
  }

  static async hasMany(articleIds: number[]) {
    const idsStr = articleIds.map((_, index) => `$${index + 1}`).join(',');

    const articles = await postgresClient.query(`
      SELECT id FROM articles WHERE id IN (${idsStr})
    `, articleIds);
    return articles.rows;
  }

  static async get(articleId: number): Promise<IArticle> {
    const article = await postgresClient.query(ArticleService.getArticleByIdQuery, [articleId]);

    if (article.rowCount) {
      return article.rows[0];
    } else {
      throw new NotFoundError();
    }
  }

  static async create(article: IInputArticle): Promise<IArticle> {
    const isArticleInDb = await ArticleService.has(article.id);

    if (!isArticleInDb) {
      const insertedResult = await postgresClient.query(`
        INSERT INTO articles(
          id,
          featured,
          title,
          url,
          image_url,
          news_site,
          summary,
          published_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING ${ArticleService.querySelectAliases}
      `, [
        article.id,
        article.featured,
        article.title,
        article.url,
        article.imageUrl,
        article.newsSite,
        article.summary,
        article.publishedAt,
      ]);

      let inserted = insertedResult.rows[0];

      if (article.events) {
        for await (let event of article.events) {
          await EventService.insertToArticle(event, inserted.id);
        }
      }

      if (article.launches) {
        for await (let launch of article.launches) {
          await LaunchService.insertToArticle(launch, inserted.id);
        }
      }

      if (article.events?.length || article.launches?.length) {
        inserted = await ArticleService.get(inserted.id);
      }

      return inserted;
    } else {
      throw new AlreadyExistsError();
    }
  }

  static async update(articleId: number, article: Omit<IInputArticle, 'id'>) {
    const isArticleInDb = await ArticleService.has(articleId);

    if (!isArticleInDb) {
      throw new NotFoundError();
    }

    await postgresClient.query(
      `
        UPDATE articles SET 
          featured = $2,
          title = $3,
          url = $4,
          image_url = $5,
          news_site = $6,
          summary = $7,
          published_at = $8
        WHERE id = $1
      `, [
        articleId,
        article.featured,
        article.title,
        article.url,
        article.imageUrl,
        article.newsSite,
        article.summary,
        article.publishedAt,
      ]
    );

    if (article.events) {
      for await (let event of article.events) {
        await EventService.insertToArticle(event, articleId);
      }
    }

    if (article.launches) {
      for await (let launch of article.launches) {
        await LaunchService.insertToArticle(launch, articleId);
      }
    }
  }

  static async delete(articleId: number) {
    const isArticleInDb = await ArticleService.has(articleId);

    if (!isArticleInDb) {
      throw new NotFoundError();
    }

    await postgresClient.query('DELETE FROM articles WHERE id = $1', [articleId]);
  }
}