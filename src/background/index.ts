import { log } from "console"

import { Storage } from "@plasmohq/storage"

import { isSameURL } from "~utils"

export interface Bookmark {
  id: string
  url: string
  dateAdded: number
}

const storage = new Storage()

export async function startCleanFlow() {
  await navigateTo("clean")
}

export async function startFlow(bookmark: Bookmark) {
  setActiveBookmark(bookmark)
  await navigateTo("main")
}

export async function navigateTo(page: "main" | "clean") {
  await chrome.tabs.update({
    url: `chrome-extension://flkknfhkmjilbcikhlgnleiiemdkmnme/tabs/${page}.html`
  })
}

export async function getActiveBookmark(): Promise<Bookmark | undefined> {
  return (await storage.get("activeBookmark")) ?? undefined
}

export async function setActiveBookmark(bookmark: Bookmark) {
  await storage.set("activeBookmark", bookmark)
}

chrome.commands.onCommand.addListener(async (command) => {
  if (command === "start-main-flow") {
    await startCleanFlow()
  }
})

chrome.webRequest.onBeforeRedirect.addListener(
  async (details) => {
    const activeBookmark = await getActiveBookmark()
    const { url, redirectUrl } = details
    if (!activeBookmark) return
    if (isSameURL(activeBookmark.url, url)) {
      log("starting new flow, redirected", url, "=>", redirectUrl)
      await startFlow({ ...activeBookmark, url: redirectUrl })
    }
  },
  { urls: ["<all_urls>"] }
)
