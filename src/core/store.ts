import { Storage } from "@plasmohq/storage"

import type { Bookmark } from "./bookmarks"

const storage = new Storage({ area: "local" })

const keys = {
  ROOT_BOOKMARK_NODE_ID: "rootBookmarkNodeId"
}

const DEFAULT_BOOKMARK_NODE_ID = "2"

export async function getRootBookmarkNodeId() {
  const id = await storage.get(keys.ROOT_BOOKMARK_NODE_ID)
  return id ?? DEFAULT_BOOKMARK_NODE_ID
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
