import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  chrome.tabs.update({
    url: "chrome-extension://flkknfhkmjilbcikhlgnleiiemdkmnme/tabs/main.html"
  })
}

export default handler
