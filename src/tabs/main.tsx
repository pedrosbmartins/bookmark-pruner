import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

import type { Bookmark } from "~background/messages/bookmark"

import "../style.css"

const storage = new Storage()

function NewTab() {
  const [activeBookmark, setActiveBookmark] = useState<Bookmark | undefined>()

  useEffect(() => {
    async function init() {
      const rootFolderId = (await storage.get("rootBookmarkNodeId")) ?? "2"
      const rootFolder = (await chrome.bookmarks.getSubTree(rootFolderId))[0]
      const randomIndex = Math.floor(
        Math.random() * rootFolder.children!.length
      )
      const randomBookmark = rootFolder.children[randomIndex]
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

  return (
    <div className="bg-[#1E1F20] h-screen m-0 p-0 flex justify-center items-center">
      <div className="pointer-events-none w-[2.5em] h-[2.5em] border-[0.4em] border-[#353739] border-t-[#555] rounded-[50%] animate-spin" />
    </div>
  )
}

export default NewTab
