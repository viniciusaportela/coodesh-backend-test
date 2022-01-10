import { connectDb, postgresClient } from "../config/connectDb";
import { syncArticlesWithApi } from "./syncArticlesWithApi";

;(async () => {
  await connectDb();
  try {
    await syncArticlesWithApi();
  } catch(e) {}
  await postgresClient.end();
})()
