import { AlreadyExistsError } from "../errors/already-exists";
import { NotFoundError } from "../errors/not-found";
import { IArticle, IInputArticle } from "../typings/article.interface";
import EventService from "./event.service";
import LaunchService from "./launch.service";
import ArticleModel from "../models/article.model";
import ArticleEventModel from "../models/article-event.model";
import ArticleLaunchModel from "../models/article-launch.model";
import { postgresClient } from "../config/connect-db";

export default class ArticleService {
  static async list(limit?: number, page?: number): Promise<IArticle[]> {
    return ArticleModel.getMany(limit, page);
  }

  static async get(articleId: number): Promise<IArticle> {
    const article = await ArticleModel.get(articleId);

    if (article) {
      return article;
    } else {
      throw new NotFoundError();
    }
  }

  static async create(article: IInputArticle): Promise<IArticle> {
    try {
      await postgresClient.query('BEGIN');
      const isArticleInDb = await ArticleModel.has(article.id);

      if (!isArticleInDb) {
        let inserted = await ArticleModel.create(article);

        if (article.events) {
          await Promise.all(article.events.map(async event => {
            await EventService.insertToArticle(event, inserted.id);
          }))
        }

        if (article.launches) {
          await Promise.all(article.launches.map(async launch => {
            await LaunchService.insertToArticle(launch, inserted.id);
          }))
        }

        if (article.events?.length || article.launches?.length) {
          inserted = await ArticleModel.get(inserted.id);
        }

        await postgresClient.query('COMMIT');

        return inserted;
      } else {
        throw new AlreadyExistsError();
      }
    } catch(error) {
      await postgresClient.query('ROLLBACK')
      throw error;
    }
  }

  static async update(articleId: number, article: IInputArticle) {
    try {
      await postgresClient.query('BEGIN');

      const articleInDb = await ArticleModel.get(articleId);

      if (!articleInDb) {
        throw new NotFoundError();
      }

      await ArticleModel.update(articleId, article);

      const eventsToRemove = articleInDb.events.filter(event => !article.events.includes(event.id));
      const eventsIdsToAdd = article.events.filter(eventId => 
        articleInDb.events.findIndex(event => event.id === eventId) === -1
      );

      await Promise.all([
        ...eventsToRemove.map(async (event) => {
          await ArticleEventModel.delete(event.id, articleId);
        }),
        ...eventsIdsToAdd.map(async (eventId) => {
          await EventService.insertToArticle(eventId, articleId);
        })
      ])

      const launchesToRemove = articleInDb.launches.filter(launch => !article.launches.includes(launch.id));
      const launchesToAdd = article.launches.filter(launchId => 
        articleInDb.launches.findIndex(launch => launch.id === launchId) === -1
      );

      await Promise.all([
        ...launchesToRemove.map(async (launch) => {
          await ArticleLaunchModel.delete(launch.id, articleId);
        }),
        ...launchesToAdd.map(async (launchId) => {
          await LaunchService.insertToArticle(launchId, articleId);
        })
      ])

      await postgresClient.query('COMMIT');
    } catch(error) {
      await postgresClient.query('ROLLBACK');
      throw error;
    }
  }

  static async delete(articleId: number) {
    const isArticleInDb = await ArticleModel.has(articleId);

    if (!isArticleInDb) {
      throw new NotFoundError();
    }

    await ArticleModel.delete(articleId);
  }
}