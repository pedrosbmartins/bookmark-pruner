import { loadNextBookmark, updateActiveBookmarkUrl } from "~core/bookmarks"
import { Command } from "~core/commands"
import * as store from "~core/store"
import { isSameURL } from "~utils"

export {}

chrome.commands.onCommand.addListener(async (command, tab) => {
  if (command === Command.LOAD_RANDOM_BOOKMARK) {
    if (tab.id === undefined) {
      return
    }
    await loadNextBookmark(tab.id)
  }
})

chrome.webRequest.onBeforeRedirect.addListener(handleRedirect, {
  urls: ["<all_urls>"]
})

async function handleRedirect(
  redirectDetails: chrome.webRequest.WebRedirectionResponseDetails
) {
  const { tabId, url, redirectUrl } = redirectDetails
  if (tabId === -1) return
  const activeBookmark = await store.getActiveBookmark(tabId)
  if (!activeBookmark || !isSameURL(activeBookmark.url, url)) {
    return
  }
  const redirectMsg = `${url} => ${redirectUrl}`
  console.info(`updating bookmark url for tab ${tabId},`, redirectMsg)
  await updateActiveBookmarkUrl(tabId, redirectUrl)
}
