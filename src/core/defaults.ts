let __DEFAULT_BOOKMARK_NODE_ID: string | undefined
const __CHROME_DEFAULT_BOOKMARK_NODE_ID = "2"
const __FIREFOX_DEFAULT_BOOKMARK_NODE_ID = "menu________"

export default {
  async BOOKMARK_NODE_ID() {
    if (__DEFAULT_BOOKMARK_NODE_ID === undefined) {
      try {
        await chrome.bookmarks.getSubTree(__FIREFOX_DEFAULT_BOOKMARK_NODE_ID)
        console.info("using firefox default node ID")
        __DEFAULT_BOOKMARK_NODE_ID = __FIREFOX_DEFAULT_BOOKMARK_NODE_ID
      } catch (e) {
        console.info("using chrome default node ID")
        __DEFAULT_BOOKMARK_NODE_ID = __CHROME_DEFAULT_BOOKMARK_NODE_ID
      }
    }
    return __DEFAULT_BOOKMARK_NODE_ID
  }
}
