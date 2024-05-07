import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const bookmarkId = req.body?.bookmarkId
  if (bookmarkId === undefined) {
    console.warn("[ditch] no bookmark id given")
  }
  console.info(`[ditch] removing bookmark ${bookmarkId}`)
  chrome.bookmarks.remove(bookmarkId)
  res.send({})
}

export default handler
