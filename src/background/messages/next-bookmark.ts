import type { MessagesMetadata, PlasmoMessaging } from "@plasmohq/messaging"

import { loadNextBookmark } from "~core/bookmarks"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const tabId = await findTabId(req)
  console.log(req)
  if (tabId === undefined) {
    console.error("next-bookmark: no sender tab found")
    res.send({})
    return
  }
  await loadNextBookmark(tabId)
  res.send({})
}

async function findTabId(req: PlasmoMessaging.Request<keyof MessagesMetadata>) {
  const id = req.sender?.tab?.id
  if (id !== undefined) {
    return id
  }
  const [currentTab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  })
  return currentTab?.id
}

export default handler
