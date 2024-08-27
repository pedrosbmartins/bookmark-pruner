import { useEffect, useState } from "react"

import { Storage } from "@plasmohq/storage"

import "../style.css"

import { sendToBackground } from "@plasmohq/messaging"

import type { Bookmark } from "~background"

import MainTab from "./main"

const storage = new Storage()

function listBookmarkIds(root: chrome.bookmarks.BookmarkTreeNode): string[] {
  if (root.children === undefined) return [root.id]
  if (root.children.length === 0) return []
  return root.children.flatMap(listBookmarkIds)
}

function CleanFlowTab() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    async function init() {
      const rootId = (await storage.get("rootBookmarkNodeId")) ?? "2"
      const root = (await chrome.bookmarks.getSubTree(rootId))[0]
      const childBookmarks = listBookmarkIds(root)
      if (childBookmarks.length === 0) {
        setIsLoaded(true)
        return
      }
      const randomIndex = Math.floor(Math.random() * childBookmarks.length)
      const randomBookmarkId = childBookmarks[randomIndex]
      const randomBookmark = (await chrome.bookmarks.get(randomBookmarkId))[0]
      const bookmark: Bookmark = {
        id: randomBookmark.id,
        url: randomBookmark.url,
        dateAdded: randomBookmark.dateAdded
      }
      await sendToBackground({
        name: "set-bookmark",
        body: { bookmark: bookmark }
      })
      setIsLoaded(true)
    }

    init()
  }, [])

  if (isLoaded) {
    return <MainTab />
  }

  return (
    <div className="bg-[#1E1F20] h-screen m-0 p-0 flex justify-center items-center">
      <div className="pointer-events-none w-[2.5em] h-[2.5em] border-[0.4em] border-[#353739] border-t-[#555] rounded-[50%] animate-spin" />
    </div>
  )
}

export default CleanFlowTab
