import { DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_PAGE } from "../constants/defaults";
import { AlreadyExistsError } from "../errors/AlreadyExists";
import { NotFoundError } from "../errors/NotFound";
import { IArticle } from "../typings/article.interface";
import { postgresClient } from "../config/connectDb";

export default class ArticleService {
  static querySelectAlias = `
    id,
    featured,
    title,
    url,
    image_url AS "imageUrl",
    news_site AS "newSite",
    summary,
    published_at AS "publishedAt"
  `

  static getQuery = `
    SELECT
      ${ArticleService.querySelectAlias}
    FROM articles WHERE id = $1
  `;

  static async list(limit?: number, page?: number) {
    const articles = await postgresClient
      .query(
        'SELECT * FROM articles LIMIT $1 OFFSET $2', 
        [limit || DEFAULT_PAGINATION_LIMIT, (page || DEFAULT_PAGINATION_PAGE) - 1]
      );

    return articles.rows;
  }

  static async has(articleId: number) {
    const article = await postgresClient.query(ArticleService.getQuery, [articleId]);
    return !!article.rowCount;
  }

  static async get(articleId: number) {
    const article = await postgresClient.query(ArticleService.getQuery, [articleId]);

    if (article.rowCount) {
      return article.rows[0];
    } else {
      throw new NotFoundError();
    }
  }

  static async create(article: IArticle) {
    const isArticleInDb = await ArticleService.has(article.id);

    if (!isArticleInDb) {
      const inserted = await postgresClient.query(`
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
        RETURNING ${ArticleService.querySelectAlias}
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

      return inserted.rows;
    } else {
      throw new AlreadyExistsError();
    }
  }

  static async update(articleId: number, article: Omit<IArticle, 'id'>) {
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
  }

  static async delete(articleId: number) {
    const isArticleInDb = await ArticleService.has(articleId);

    if (!isArticleInDb) {
      throw new NotFoundError();
    }

    await postgresClient.query('DELETE FROM articles WHERE id = $1', [articleId]);
  }
}