import { NextFunction, Request, Response } from "express";
import EventService from "../../services/event.service";
import { EventValidation } from "./event.validation";

export default class LaunchController {
  static validation = EventValidation;

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.params;
      const event = await EventService.get(parseInt(eventId));
      res.json(event);
    } catch (error) {
      next(error);
    }
  }

  static async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const events = await EventService.list();
      res.json(events);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, provider } = req.body;
      const insertedEvent = await EventService.create(provider, id);
      res.status(201).json(insertedEvent);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { provider } = req.body;
      const { eventId } = req.params;
      await EventService.update(parseInt(eventId), provider);
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.params;
      await EventService.delete(parseInt(eventId));
      res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }
}