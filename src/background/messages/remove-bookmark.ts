import type { PlasmoMessaging } from "@plasmohq/messaging"

import * as store from "~core/store"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const tabId = req.sender?.tab?.id
  if (tabId === undefined) {
    console.warn("remove-bookmark: tab id not found")
    res.send({})
    return
  }
  const bookmark = await store.getActiveBookmark(tabId)
  if (!bookmark) {
    console.warn("remove-bookmark: active bookmark not found")
    res.send({})
    return
  }
  console.info(`remove-bookmark: tab ${tabId}, bookmark ${bookmark.id}`)
  await chrome.bookmarks.remove(bookmark.id)
  res.send({})
}

export default handler
