import MailService from "../../services/mail.service";
import { envConfig } from "../../config/env";
import { SYNC_ARTICLES_PER_PAGE } from "../../constants/config";
import { IArticle } from "../../typings/article.interface";
import ArticleService from "../../services/article.service";
import fetch from 'node-fetch';
import EventService from "../../services/event.service";
import LaunchService from "../../services/launch.service";
import ArticleModel from "../../models/article.model";
import EventModel from "../../models/event.model";
import LaunchModel from "../../models/launch.model";
import { getLastPageFromCache, saveLastPageIndex } from "./sync-article-from-api-cache";

const IMPORT_MESSAGE_INTERVAL_TO_LOG = 100;

export async function syncArticlesFromApi() {
  try {
    console.log('[syncArticlesFromApi] Executing script syncArticlesWithApi...');

    const response = await fetch(`${envConfig.syncFetchApi}/articles/count`);
    const responseText = await response.text()
    const articlesCount = parseInt(responseText);
    let importedCount = 0;

    const initialPage = (await getLastPageFromCache()) + 1;

    for (let page = initialPage; page < articlesCount / SYNC_ARTICLES_PER_PAGE; page += 1) {
      if (page % IMPORT_MESSAGE_INTERVAL_TO_LOG === 0) {
        console.log(`[syncArticlesFromApi] Importing page ${page}-${page + IMPORT_MESSAGE_INTERVAL_TO_LOG}`);
      }

      const response = await fetch(`${envConfig.syncFetchApi}/articles?_sort=id&_limit=${SYNC_ARTICLES_PER_PAGE}&_start=${page * SYNC_ARTICLES_PER_PAGE}`);
      const articles = await response.json() as IArticle[];

      const articlesIdsInDb = await ArticleModel.hasMany(articles.map(article => article.id));
      const articlesToAdd = articles.filter(article => !articlesIdsInDb.includes(article.id));

      const eventsAdded = new Set();
      const launchesAdded = new Set();

      await Promise.all(articlesToAdd.map(async article => {
        const input = {
          ...article,
          events: article.events.map(event => event.id),
          launches: article.launches.map(launch => launch.id),
        }
  
        await Promise.all(article.events.map(async (event) => {
          const hasEventInDb = await EventModel.has(event.id);
  
          if (!hasEventInDb) {
            if (!eventsAdded.has(event.id)) {
              eventsAdded.add(event.id);
              await EventService.create(event.provider, event.id);
            }
          }
        }));
  
        await Promise.all(article.launches.map(async (launch) => {
          const hasLaunchInDb = await LaunchModel.has(launch.id);
  
          if (!hasLaunchInDb) {
            if (!launchesAdded.has(launch.id)) {
              launchesAdded.add(launch.id);
              await LaunchService.create(launch.provider, launch.id);
            }
          }
        }));
  
        importedCount += 1;
  
        await ArticleService.create(input);
      }))

      saveLastPageIndex(page);
    }

    console.log(`[syncArticlesFromApi] Finished script syncArticlesWithApi, imported ${importedCount} articles`);
  } catch(error) {
    console.error(`[syncArticlesFromApi] Something went wrong when trying to run the script "syncArticlesWithApi", error: ${error}, stack: ${error?.stack}`);

    await MailService.send({
      to: envConfig.reportReceiverEmail,
      subject: 'An error occurred on Space Flight Articles Sync',
      html: `
        Something went wrong when trying to run the script "syncArticlesWithApi", error: <br/><br/>
        ${error}, <br/><br/>
        stack: ${error?.stack}
      `
    });
  }
}