import { DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_PAGE } from "../constants/defaults";
import { AlreadyExistsError } from "../errors/AlreadyExists";
import { NotFoundError } from "../errors/NotFound";
import { IArticle } from "../models/article/article.interface";
import ArticleModel from "../models/article/article.model";

export default class ArticleService {
  static async list(limit?: number, page?: number) {
    return ArticleModel
      .find()
      .limit(limit | DEFAULT_PAGINATION_LIMIT)
      .skip((page || DEFAULT_PAGINATION_PAGE) - 1)
      .exec();
  }

  static async create(article: IArticle) {
    const articleInDb = await ArticleModel.findOne({ _id: article.id });

    if (!articleInDb) {
      const inserted = await ArticleModel.create(article);
      return inserted;
    } else {
      throw new AlreadyExistsError();
    }
  }

  static async update(articleId: string, article: IArticle) {
    const articleInDb = await ArticleModel.findOne({ _id: articleId });

    if (articleInDb && articleInDb._id.toString() !== articleId) {
      throw new AlreadyExistsError();
    }

    const affected = await ArticleModel.updateOne(
      { _id: articleId },
      article
    );

    if (affected.modifiedCount === 0) {
      throw new NotFoundError();
    }
  }

  static async delete(articleId: string) {
    const affected = await ArticleModel.deleteOne({ _id: articleId });

    if (affected.deletedCount === 0) {
      throw new NotFoundError();
    }
  }
}