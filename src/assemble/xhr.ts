// Refactor: xmlhttprequest will be replaced later
// @ts-ignore
import xhrForNode from "xmlhttprequest";
import { inBrowser, isString } from "@luckrya/utility";

// TODO: Local File Cache
const cache = new Map<string, string>();
const XHR = inBrowser ? window.XMLHttpRequest : xhrForNode.XMLHttpRequest;

export function sync(url: string) {
  if (cache.has(url)) return cache.get(url);

  let result: string | undefined;

  try {
    const xhr = new XHR();

    xhr.open("GET", url, false);
    xhr.setRequestHeader("Content-Type", "text/html");
    xhr.send();

    if (xhr.status === 200 && !!xhr.responseText) {
      result = xhr.responseText;
      cache.set(url, xhr.responseText);
    }
  } catch (err) {
    console.error(
      `【XHR Error】：${
        err instanceof Error
          ? err.message
          : "get remote URL resource exception!"
      }`
    );
  }

  return result;
}

export function async(url: string): Promise<string | undefined> {
  return new Promise((resolve, reject) => {
    try {
      if (cache.has(url)) return resolve(cache.get(url));

      const xhr = new XHR();
      xhr.open("GET", url, false);
      xhr.setRequestHeader("Content-Type", "text/html");
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          if (isString(xhr.responseText)) {
            cache.set(url, xhr.responseText);
            resolve(xhr.responseText);
          }
        }
      };
      xhr.send();
    } catch (err) {
      reject(err);
    }
  });
}
