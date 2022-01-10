import { AlreadyExistsError } from "../errors/already-exists";
import { NotFoundError } from "../errors/not-found";
import ArticleLaunchModel from "../models/article-launch.model";
import ArticleModel from "../models/article.model";
import LaunchModel from "../models/launch.model";

export default class LaunchService {
  static async get(launchId: string) {
    const launch = await LaunchModel.get(launchId);

    if (launch) {
      return launch;
    } else {
      throw new NotFoundError("This launch doesn't exists");
    }
  }

  static async create(provider: string, launchId?: string) {
    let isLaunchInDb = false
    if (launchId) {
      isLaunchInDb = await LaunchModel.has(launchId);
    }

    if (!isLaunchInDb) {
      await LaunchModel.create({
        id: launchId,
        provider: provider,
      });
    } else {
      throw new AlreadyExistsError();
    }
  }

  static async update(launchId: string, provider: string) {
    const launchInDb = await LaunchModel.has(launchId);

    if (!launchInDb) {
      throw new NotFoundError("This launch doesn't exists");
    }

    await LaunchModel.update(launchId, { provider })
  }

  static async delete(launchId: string) {
    const launchInDb = await LaunchModel.has(launchId);

    if (!launchInDb) {
      throw new NotFoundError("This launch doesn't exists");
    }

    await LaunchModel.delete(launchId);
  }

  static async insertToArticle(launchId: string, articleId: number) {
    const articleExists = await ArticleModel.has(articleId);

    if (!articleExists) {
      throw new NotFoundError("This article doesn't exists");
    }

    const launchExists = await LaunchModel.has(launchId);
    if (!launchExists) {
      throw new NotFoundError("This launch doesn't exists");
    }

    await ArticleLaunchModel.create(launchId, articleId);
  }
}