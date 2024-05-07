import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

import type { Bookmark } from "~background/messages/bookmark"

import "../style.css"

const storage = new Storage()

function listBookmarkIds(root: chrome.bookmarks.BookmarkTreeNode): string[] {
  if (root.children === undefined) return [root.id]
  if (root.children.length === 0) return []
  return root.children.flatMap(listBookmarkIds)
}

function NewTab() {
  const [activeBookmark, setActiveBookmark] = useState<Bookmark | undefined>()
  const [isFolderEmpty, setIsFolderEmpty] = useState(false)

  useEffect(() => {
    async function init() {
      const rootId = (await storage.get("rootBookmarkNodeId")) ?? "2"
      const root = (await chrome.bookmarks.getSubTree(rootId))[0]
      const childBookmarks = listBookmarkIds(root)
      if (childBookmarks.length === 0) {
        setIsFolderEmpty(true)
        return
      }
      const randomIndex = Math.floor(Math.random() * childBookmarks.length)
      const randomBookmarkId = childBookmarks[randomIndex]
      const randomBookmark = (await chrome.bookmarks.get(randomBookmarkId))[0]
      const { id, url, dateAdded } = randomBookmark
      setActiveBookmark({ id, url, dateAdded })
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
      {isFolderEmpty ? (
        <span className="text-white text-lg text-center">
          Root folder is empty.
        </span>
      ) : (
        <div className="pointer-events-none w-[2.5em] h-[2.5em] border-[0.4em] border-[#353739] border-t-[#555] rounded-[50%] animate-spin" />
      )}
    </div>
  )
}

export default NewTab
