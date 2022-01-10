import { connectDb, postgresClient } from "../config/connectDb";
import { syncArticlesFromApi } from "./syncArticlesFromApi";

;(async () => {
  await connectDb();
  try {
    await syncArticlesFromApi();
  } catch(e) {}
  await postgresClient.end();
})()
