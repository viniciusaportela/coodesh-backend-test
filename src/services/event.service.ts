import { AlreadyExistsError } from "../errors/already-exists";
import { NotFoundError } from "../errors/not-found";
import ArticleEventModel from "../models/article-event.model";
import ArticleModel from "../models/article.model";
import EventModel from "../models/event.model";

export default class EventService {
  static async get(eventId: number) {
    const event = await EventModel.get(eventId);

    if (event) {
      return event;
    } else {
      throw new NotFoundError();
    }
  }

  static async create(provider: string, eventId?: number) {
    let isEventInDb = false
    if (eventId) {
      isEventInDb = await EventModel.has(eventId);
    }

    if (!isEventInDb) {
      await EventModel.create({
        id: eventId,
        provider: provider,
      });
    } else {
      throw new AlreadyExistsError();
    }
  }

  static async update(eventId: number, provider: string) {
    const eventInDb = await EventModel.has(eventId);

    if (!eventInDb) {
      throw new NotFoundError();
    }

    await EventModel.update(eventId, { provider })
  }

  static async delete(eventId: number) {
    const eventInDb = await EventModel.has(eventId);

    if (!eventInDb) {
      throw new NotFoundError();
    }

    await EventModel.delete(eventId);
  }

  static async insertToArticle(eventId: number, articleId: number) {
    const articleExists = await ArticleModel.has(articleId);

    if (!articleExists) {
      throw new NotFoundError("this article doesn't exists");
    }

    const eventExists = await EventModel.has(eventId)
    if (!eventExists) {
      throw new NotFoundError("this event doesn't exists");
    }

    await ArticleEventModel.create(eventId, articleId);
  }
}