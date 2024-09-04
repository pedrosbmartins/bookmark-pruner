import { persistActiveBookmark, selectRandomBookmark } from "~core/bookmarks"
import { buildFailedMessage, buildLoadingMessage } from "~core/messaging"

export {}

chrome.commands.onCommand.addListener(async (command, tab) => {
  if (command === "start-main-flow") {
    await chrome.tabs.sendMessage(tab.id, buildLoadingMessage())
    try {
      const bookmark = await selectRandomBookmark()
      await persistActiveBookmark(tab.id, bookmark)
      await chrome.tabs.update(undefined, { url: bookmark.url })
    } catch (error) {
      await chrome.tabs.sendMessage(tab.id, buildFailedMessage(error))
    }
  }
})
