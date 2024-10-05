import type { PlasmoMessaging } from "@plasmohq/messaging"

import type { Bookmark } from "~core/bookmarks"
import * as store from "~core/store"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const tabId = req.sender?.tab?.id
  if (tabId === undefined) {
    res.send({})
    return
  }
  const bookmark = await store.getActiveBookmark(tabId)
  res.send({ bookmark: bookmark as Bookmark | undefined })
}

export default handler
