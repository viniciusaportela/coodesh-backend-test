import { NextFunction, Request, Response } from "express";
import { PAGINATION_MAX_LIMIT } from "../../constants/config";
import { PassedPaginationLimitError } from "../../errors/passed-pagination-limit";
import LaunchService from "../../services/launch.service";
import { LaunchValidation } from "./launch.validation";

export default class LaunchController {
  static validation = LaunchValidation;

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const { launchId } = req.params;
      const launch = await LaunchService.get(launchId);
      res.json(launch);
    } catch (error) {
      next(error);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { limit, page } = req.query as Record<string, string>;

      if (parseInt(limit) > PAGINATION_MAX_LIMIT) {
        throw new PassedPaginationLimitError();
      }

      const launches = await LaunchService.list(parseInt(limit), parseInt(page));
      res.json(launches);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, provider } = req.body;
      const insertedLaunch = await LaunchService.create(provider, id);
      res.status(201).json(insertedLaunch);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { provider } = req.body;
      const { launchId } = req.params;
      await LaunchService.update(launchId, provider);
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { launchId } = req.params;
      await LaunchService.delete(launchId);
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }
}