import MailService from "../services/mail.service";
import { env } from "../config/env";
import { SYNC_ARTICLES_PER_PAGE } from "../constants/config";
import { IArticle } from "../typings/article.interface";
import ArticleService from "../services/article.service";
import fetch from 'node-fetch';
import EventService from "../services/event.service";
import LaunchService from "../services/launch.service";
import ArticleModel from "../models/article.model";

const IMPORT_MESSAGE_INTERVAL = 100;

export async function syncArticlesFromApi() {
  try {
    console.log('Executing script syncArticlesWithApi...');

    const response = await fetch(`${env.syncFetchApi}/articles/count`);
    const responseText = await response.text()
    const articlesCount = parseInt(responseText);
    let importedCount = 0;

    for (let page = 0; page < articlesCount / SYNC_ARTICLES_PER_PAGE; page += 1) {
      if (page % IMPORT_MESSAGE_INTERVAL === 0) console.log(`Importing page ${page}-${page + IMPORT_MESSAGE_INTERVAL}`);
      const response = await fetch(`${env.syncFetchApi}/articles?_sort=id&_limit=${SYNC_ARTICLES_PER_PAGE}&_start=${page * SYNC_ARTICLES_PER_PAGE}`);
      const articles = await response.json() as IArticle[];

      const articlesIdsInDb = await ArticleModel.hasMany(articles.map(article => article.id));
      const articlesToAdd = articles.filter(article => !articlesIdsInDb.includes(article.id));

      await Promise.all(articlesToAdd.map(async article => {
        const input = {
          ...article,
          events: article.events.map(event => event.id),
          launches: article.launches.map(launch => launch.id),
        }

        await Promise.all(article.events.map(async (event) => {
          const hasEvent = await EventService.has(event.id);

          if (!hasEvent) {
            await EventService.create(event.provider, event.id)
          }
        }))

        await Promise.all(article.launches.map(async (launch) => {
          const hasLaunch = await LaunchService.has(launch.id);

          if (!hasLaunch) {
            await LaunchService.create(launch.provider, launch.id)
          }
        }))

        importedCount += 1;

        await ArticleService.create(input);
      }))
    }

    console.log(`Finished script syncArticlesWithApi, imported ${importedCount} articles`);
  } catch(error) {
    console.error(`Something went wrong when trying to run the script "syncArticlesWithApi", error: ${error}, stack: ${error?.stack}`);

    await MailService.send({
      to: env.reportReceiverEmail,
      subject: 'An error occurred on Space Flight Articles Sync',
      html: `
        Something went wrong when trying to run the script "syncArticlesWithApi", error: <br/><br/>
        ${error}, <br/><br/>
        stack: ${error?.stack}
      `
    });
  }
}