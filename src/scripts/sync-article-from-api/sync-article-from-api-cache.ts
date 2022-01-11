import { mkdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function getLastPageFromCache() {
  const cacheFilePath = join(__dirname, '../data/sync-articles-from-api.json');
  const cacheFileExists = existsSync(cacheFilePath);

  if (!cacheFileExists) {
    return -1;
  }

  const cacheFileRaw = await readFile(cacheFilePath, 'utf-8');
  const cacheFile = JSON.parse(cacheFileRaw);

  return cacheFile.lastPage;
}

export async function saveLastPageIndex(page: number) {
  const dataFolderPath = join(__dirname, '../data');

  const dataFolderExists = existsSync(dataFolderPath);
  if (!dataFolderExists) {
    await mkdir(dataFolderPath);
  }

  await writeFile(join(dataFolderPath, 'sync-articles-from-api.json'), JSON.stringify({ lastPage: page }));
}