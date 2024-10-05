import * as store from "./store"

export interface Bookmark {
  id: string
  url: string
  dateAdded: number
}

export async function loadNextBookmark(tabId: number) {
  const bookmark = await selectRandomBookmark()
  await store.persistActiveBookmark(tabId, bookmark)
  await chrome.tabs.update({ url: bookmark.url })
}

export async function updateActiveBookmarkUrl(tabId: number, newUrl: string) {
  const bookmark = await store.getActiveBookmark(tabId)
  if (!bookmark) {
    console.error("update bookmark url: could not find bookmark")
    return
  }
  await store.persistActiveBookmark(tabId, { ...bookmark, url: newUrl })
}

async function selectRandomBookmark() {
  const rootId = await store.getRootBookmarkNodeId()
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
    url: chromeBookmark.url!,
    dateAdded: chromeBookmark.dateAdded!
  }
}
