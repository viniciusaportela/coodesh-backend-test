import { AlreadyExistsError } from "../errors/already-exists";
import { NotFoundError } from "../errors/not-found";
import { IArticle, IInputArticle } from "../typings/article.interface";
import EventService from "./event.service";
import LaunchService from "./launch.service";
import ArticleModel from "../models/article.model";

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

      return inserted;
    } else {
      throw new AlreadyExistsError();
    }
  }

  static async update(articleId: number, article: IInputArticle) {
    const isArticleInDb = await ArticleModel.has(articleId);

    if (!isArticleInDb) {
      throw new NotFoundError();
    }

    await ArticleModel.update(articleId, article);

    // TODO remove old events and launches

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
    const isArticleInDb = await ArticleModel.has(articleId);

    if (!isArticleInDb) {
      throw new NotFoundError();
    }

    await ArticleModel.delete(articleId);
  }
}