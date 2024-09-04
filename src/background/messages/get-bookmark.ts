import type { PlasmoMessaging } from "@plasmohq/messaging"

import { getActiveBookmark, type Bookmark } from "~core/bookmarks"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const bookmark = await getActiveBookmark(req.sender?.tab?.id)
  res.send({ bookmark: bookmark as Bookmark | undefined })
}

export default handler
