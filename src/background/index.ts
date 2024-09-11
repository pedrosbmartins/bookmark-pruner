import { nextBookmark } from "~core/bookmarks"

export {}

chrome.commands.onCommand.addListener(async (command, tab) => {
  if (command === "start-main-flow") {
    if (!tab.id) {
      return
    }
    await nextBookmark(tab.id)
  }
})
