import { postgresClient } from "../config/connect-db";
import { DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_PAGE } from "../constants/defaults";
import { IArticle, IInputArticle } from "../typings/article.interface";

export default class ArticleModel {
  private static querySelectAliases = `
    id,
    featured,
    title,
    url,
    image_url AS "imageUrl",
    news_site AS "newSite",
    summary,
    published_at AS "publishedAt"
  `

  private static selectAndJoinArticlesQuery = `
    SELECT
      ${this.querySelectAliases},
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

  static async has(articleId: number) {
    const article = await postgresClient.query('SELECT id FROM articles WHERE id = $1', [articleId]);
    return !!article.rowCount;
  }

  static async hasMany(articleIds: number[]): Promise<number[]> {
    const idsStr = articleIds.map((_, index) => `$${index + 1}`).join(',');

    const articles = await postgresClient.query(`
      SELECT id FROM articles WHERE id IN (${idsStr})
    `, articleIds);

    return articles.rows.map(article => article.id);
  }

  static async get(id: number): Promise<IArticle> {
    const result = await postgresClient.query(`${this.selectAndJoinArticlesQuery} ORDER BY id WHERE id = $1`, [id]); 
    return result.rows[0];
  }

  static async getMany(limit?: number, page?: number): Promise<IArticle[]> {
    return (await postgresClient
      .query(
        `${this.selectAndJoinArticlesQuery} ORDER BY id LIMIT $1 OFFSET $2`,
        [limit || DEFAULT_PAGINATION_LIMIT, (page || DEFAULT_PAGINATION_PAGE) - 1]
      )).rows;
  }

  static async create(article: IInputArticle): Promise<IArticle> {
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
        RETURNING ${this.querySelectAliases}
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
    
      return insertedResult.rows[0];
  }

  static async update(articleId: number, article: IInputArticle) {
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
  }

  static async delete(articleId: number) {
    await postgresClient.query('DELETE FROM articles WHERE id = $1', [articleId]);
  }
}