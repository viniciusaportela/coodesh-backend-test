import { connectDb, postgresClient } from "../../config/connect-db";
import { syncArticlesFromApi } from "./sync-article-from-api";

;(async () => {
  await connectDb();
  try {
    await syncArticlesFromApi();
  } catch(e) {}
  await postgresClient.end();
})()
