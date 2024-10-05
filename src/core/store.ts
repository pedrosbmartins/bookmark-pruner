import { Storage } from "@plasmohq/storage"

import type { Bookmark } from "./bookmarks"

const storage = new Storage({ area: "local" })

const keys = {
  ROOT_BOOKMARK_NODE_ID: "rootBookmarkNodeId"
}

// @todo: move to separate file
let DEFAULT_BOOKMARK_NODE_ID: string | undefined
const DEFAULT_CHROME_BOOKMARK_NODE_ID = "2"
const DEFAULT_FIREFOX_BOOKMARK_NODE_ID = "menu________"

export async function getRootBookmarkNodeId() {
  const id = await storage.get(keys.ROOT_BOOKMARK_NODE_ID)
  if (DEFAULT_BOOKMARK_NODE_ID === undefined) {
    try {
      await chrome.bookmarks.getSubTree(DEFAULT_FIREFOX_BOOKMARK_NODE_ID)
      console.info("using firefox default node ID")
      DEFAULT_BOOKMARK_NODE_ID = DEFAULT_FIREFOX_BOOKMARK_NODE_ID
    } catch (e) {
      console.info("using chrome default node ID")
      DEFAULT_BOOKMARK_NODE_ID = DEFAULT_CHROME_BOOKMARK_NODE_ID
    }
  }
  return id ?? (DEFAULT_BOOKMARK_NODE_ID as string)
}

export async function setRootBookmarkNodeId(id: string) {
  await storage.set(keys.ROOT_BOOKMARK_NODE_ID, id)
}

export async function getActiveBookmark(
  tabId: number
): Promise<Bookmark | undefined> {
  return await storage.get<undefined>(tabId.toString())
}

export async function persistActiveBookmark(tabId: number, bookmark: Bookmark) {
  await storage.set(tabId.toString(), bookmark)
}
