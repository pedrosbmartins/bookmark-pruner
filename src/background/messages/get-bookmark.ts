import type { PlasmoMessaging } from "@plasmohq/messaging"

import { getActiveBookmark, type Bookmark } from "~core/bookmarks"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const tabId = req.sender?.tab?.id
  if (tabId === undefined) {
    res.send({})
    return
  }
  const bookmark = await getActiveBookmark(tabId)
  res.send({ bookmark: bookmark as Bookmark | undefined })
}

export default handler
