import { NextFunction, Request, Response } from "express";
import ArticleService from "../../services/article.service";
import { ArticleValidation } from "./article.validation";
import { PAGINATION_MAX_LIMIT } from "../../constants/config";
import { PassedPaginationLimitError } from "../../errors/PassedPaginationLimit";

export default class ArticleController {
  static validation = ArticleValidation;

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { limit, page } = req.query as Record<string, string>;

      if (parseInt(limit) > PAGINATION_MAX_LIMIT) {
        throw new PassedPaginationLimitError();
      }

      const articles = await ArticleService.list(
        parseInt(limit), 
        parseInt(page)
      );

      res.json(articles);
    } catch (error) {
      next(error);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const { articleId } = req.params;
      const article = await ArticleService.get(parseInt(articleId));
      res.json(article);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const article = req.body;
      let insertedArticle = await ArticleService.create(article);
      res.status(201).json(insertedArticle);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const article = req.body;
      const { articleId } = req.params;
      await ArticleService.update(parseInt(articleId), article);
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { articleId } = req.params;
      await ArticleService.delete(parseInt(articleId));
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }
}