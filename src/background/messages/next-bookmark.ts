import type { PlasmoMessaging } from "@plasmohq/messaging"

import { nextBookmark } from "~core/bookmarks"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const tabId = req.sender?.tab?.id
  if (tabId) {
    await nextBookmark(tabId)
  } else {
    console.error("next-bookmark: no sender tab found")
  }
  res.send({})
}

export default handler
