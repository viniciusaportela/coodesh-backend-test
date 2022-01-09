import { NextFunction, Request, Response } from "express";
import ArticleService from "../../services/article.service";
import { ArticleValidation } from "./article.validation";

export default class ArticleController {
  static validation = ArticleValidation;

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { limit, page } = req.body;

      const articles = await ArticleService.list(limit, page);
      res.json(articles);
    } catch (e) {
      next(e);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    const article = req.body;

    try {
      const inserted = await ArticleService.create(article);
      res.status(201).json(inserted);
    } catch (e) {
      next(e);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    const article = req.body;
    const { article: articleId } = req.params;

    try {
      await ArticleService.update(articleId, article);
      res.sendStatus(200);
    } catch (e) {
      next(e);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    const { article } = req.params;

    try {
      await ArticleService.delete(article);
      res.sendStatus(200);
    } catch (e) {
      next(e);
    }
  }
}