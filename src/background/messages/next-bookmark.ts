import type { MessagesMetadata, PlasmoMessaging } from "@plasmohq/messaging"

import { loadNextBookmark } from "~core/bookmarks"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const tabId = await findTabId(req)
  if (tabId === undefined) {
    console.error("next-bookmark: no tab found")
    res.send({})
    return
  }
  await loadNextBookmark(tabId)
  res.send({})
}

async function findTabId(req: PlasmoMessaging.Request<keyof MessagesMetadata>) {
  const senderTabId = req.sender?.tab?.id
  return senderTabId ?? (await currentTabId())
}

async function currentTabId() {
  const [currentTab] = await chrome.tabs.query({ active: true })
  return currentTab?.id
}

export default handler
