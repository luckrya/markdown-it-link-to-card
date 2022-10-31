import type { UrlMetadata } from "../types";
import { parserMetadata, xhr } from ".";
import LocalFileCache from "./local-file-cache";

const cache = new LocalFileCache<UrlMetadata>();

export function getUrlMetadata(url: string) {
  if (cache.has(url)) return cache.get(url);

  let metadata: UrlMetadata | null = null;

  const htmlString = xhr.sync(url);

  if (htmlString) {
    metadata = parserMetadata(htmlString, url);

    if (metadata) cache.set(url, metadata);
  }

  return metadata;
}
