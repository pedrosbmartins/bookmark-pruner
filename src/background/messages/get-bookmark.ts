import type { PlasmoMessaging } from "@plasmohq/messaging"

import { getActiveBookmark } from "~background"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const bookmark = await getActiveBookmark()
  res.send({ bookmark })
}

export default handler
