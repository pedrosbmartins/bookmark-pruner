import type { PlasmoMessaging } from "@plasmohq/messaging"

import { startCleanFlow } from "~background"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  await startCleanFlow()
  res.send({})
}

export default handler
