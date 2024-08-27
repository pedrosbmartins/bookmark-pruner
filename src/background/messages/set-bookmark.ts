import type { PlasmoMessaging } from "@plasmohq/messaging"

import { setActiveBookmark } from "~background"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  if (req.body?.bookmark) {
    await setActiveBookmark(req.body?.bookmark)
  }
  res.send({})
}

export default handler
