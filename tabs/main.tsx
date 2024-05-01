import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import type { Bookmark } from "~background/messages/bookmark"

import "../style.css"

function NewTab() {
  const [activeBookmark, setActiveBookmark] = useState<Bookmark | undefined>()

  useEffect(() => {
    async function init() {
      const otherBookmarks = (await chrome.bookmarks.getSubTree("2"))[0]
      const randomIndex = Math.floor(
        Math.random() * otherBookmarks.children!.length
      )
      const randomBookmark = otherBookmarks.children[randomIndex]
      const { url, dateAdded } = randomBookmark
      setActiveBookmark({ url: url!, dateAdded: dateAdded! })
    }

    init()
  }, [])

  useEffect(() => {
    async function register() {
      await sendToBackground({
        name: "bookmark",
        body: { bookmark: activeBookmark }
      })
      window.location.href = activeBookmark.url
    }

    if (activeBookmark) register()
  }, [activeBookmark])

  return <div>You're being redirected</div>
}

export default NewTab
