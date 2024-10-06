const CHROME_INIT_BOOKMARK_NODE_ID = "2"
const FIREFOX_INIT_BOOKMARK_NODE_ID = "menu________"
export const INIT_BOOKMARK_NODE_ID =
  process.env.PLASMO_BROWSER === "firefox"
    ? FIREFOX_INIT_BOOKMARK_NODE_ID
    : CHROME_INIT_BOOKMARK_NODE_ID
