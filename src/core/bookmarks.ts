import { Storage } from "@plasmohq/storage"

const storage = new Storage({ area: "local" })

export interface Bookmark {
  id: string
  url: string
  dateAdded: number
}

export async function selectRandomBookmark() {
  const rootId = (await storage.get("rootBookmarkNodeId")) ?? "2"
  const root = (await chrome.bookmarks.getSubTree(rootId))[0]
  const childBookmarks = listBookmarkIds(root)
  if (childBookmarks.length === 0) {
    throw new Error("empty bookmark list.")
  }
  const randomIndex = Math.floor(Math.random() * childBookmarks.length)
  const randomBookmarkId = childBookmarks[randomIndex]
  const randomBookmark = (await chrome.bookmarks.get(randomBookmarkId))[0]
  return buildBookmark(randomBookmark)
}

export async function persistActiveBookmark(tabId: number, bookmark: Bookmark) {
  await storage.set(tabId.toString(), bookmark)
}

export async function getActiveBookmark(
  tabId: number
): Promise<Bookmark | undefined> {
  return await storage.get<undefined>(tabId.toString())
}

function listBookmarkIds(root: chrome.bookmarks.BookmarkTreeNode): string[] {
  if (root.children === undefined) return [root.id]
  if (root.children.length === 0) return []
  return root.children.flatMap(listBookmarkIds)
}

function buildBookmark(
  chromeBookmark: chrome.bookmarks.BookmarkTreeNode
): Bookmark {
  return {
    id: chromeBookmark.id,
    url: chromeBookmark.url,
    dateAdded: chromeBookmark.dateAdded
  }
}
