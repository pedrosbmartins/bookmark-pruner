import { Storage } from "@plasmohq/storage"

import type { Bookmark } from "./bookmarks"
import defaults from "./defaults"

const storage = new Storage({ area: "local" })

const keys = {
  ROOT_BOOKMARK_NODE_ID: "rootBookmarkNodeId"
}

export async function getRootBookmarkNodeId() {
  const id = await storage.get(keys.ROOT_BOOKMARK_NODE_ID)
  return id ?? (await defaults.BOOKMARK_NODE_ID())
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
