import type { PlasmoMessaging } from "@plasmohq/messaging"

export interface Bookmark {
  url: string
  dateAdded: number
}

let activeBookmark: Bookmark | undefined

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  if (req.body?.bookmark) {
    activeBookmark = req.body.bookmark
  }
  res.send({ bookmark: activeBookmark })
}

export default handler
