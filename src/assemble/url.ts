export function extractUrl(url: string) {
  try {
    return new URL(url);
  } catch {}
}

export function cleanPath(path: string) {
  return path.replace(/\/\//g, "/");
}
