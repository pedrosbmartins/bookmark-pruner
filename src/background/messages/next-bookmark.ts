import type { PlasmoMessaging } from "@plasmohq/messaging"

import { loadNextBookmark } from "~core/bookmarks"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const tabId = req.sender?.tab?.id
  if (tabId === undefined) {
    console.error("next-bookmark: no sender tab found")
    res.send({})
    return
  }
  await loadNextBookmark(tabId)
  res.send({})
}

export default handler
