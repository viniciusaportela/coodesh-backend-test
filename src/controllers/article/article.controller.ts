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
    } catch (error) {
      next(error);
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const { articleId } = req.params;

      const article = await ArticleService.get(articleId);
      res.json(article);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    const article = req.body;

    try {
      const inserted = await ArticleService.create(article);
      res.status(201).json(inserted);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    const article = req.body;
    const { articleId } = req.params;

    try {
      await ArticleService.update(articleId, article);
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    const { articleId } = req.params;

    try {
      await ArticleService.delete(articleId);
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }
}