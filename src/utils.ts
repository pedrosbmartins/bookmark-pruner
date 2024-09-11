export function isSameURL(urlFrom: string, urlTo: string) {
  return stripScheme(urlFrom) === stripScheme(urlTo)
}

function stripScheme(url: string) {
  return url.replace(/^https?/, "")
}
