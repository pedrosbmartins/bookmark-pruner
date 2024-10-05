import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import commands from "~core/commands"
import { getRootBookmarkNodeId, setRootBookmarkNodeId } from "~core/store"

import "./style.css"

interface BookmarkFolder {
  id: string
  title: string
}

export default function IndexPopup() {
  const [shortcut, setShortcut] = useState<string | undefined>()
  const [rootFolderId, setRootFolderId] = useState("")
  const [folders, setFolders] = useState<BookmarkFolder[]>([])

  useEffect(() => {
    setupShortcuts()
    setupFolders()
    setupRootFolder()
  }, [])

  useEffect(() => {
    setRootBookmarkNodeId(rootFolderId)
  }, [rootFolderId])

  function setupShortcuts() {
    chrome.commands.getAll((commandList) => {
      for (let { name, shortcut } of commandList) {
        if (name === commands.LOAD_RANDOM_BOOKMARK) {
          setShortcut(shortcut)
        }
      }
    })
  }

  async function setupFolders() {
    const root = (await chrome.bookmarks.getTree())[0]
    setFolders(listFolders(root))
  }

  function listFolders(
    root: chrome.bookmarks.BookmarkTreeNode
  ): { id: string; title: string }[] {
    if (root.children === undefined || root.children.length === 0) return []
    return [
      { id: root.id, title: root.title ?? "Root" },
      ...root.children.flatMap(listFolders)
    ]
  }

  async function setupRootFolder() {
    setRootFolderId(await getRootBookmarkNodeId())
  }

  return (
    <div className="w-[300px] bg-[#29282D] text-white">
      <div className="bg-[rgba(0,0,0,0.25)] p-4">
        <h2 className="text-lg font-thin text-gray-100">Bookmark Pruner</h2>
      </div>
      <div className="bg-[rgba(0,0,0,0.25)] p-4 text-[1.2em] flex flex-col items-center">
        <button
          className="w-[80%] py-2 px-10 bg-blue-500 rounded-md uppercase text-[0.8em] font-bold"
          onClick={async () => {
            await sendToBackground({ name: "next-bookmark" })
          }}>
          Random bookmark
        </button>
        <span className="text-center my-2 text-[0.9em] text-gray-400">
          {shortcut}
        </span>
      </div>
      <div className="p-4 text-[1.2em]">
        <h3 className="font-bold">Root folder</h3>
        <ul className="font-mono max-h-[200px] overflow-y-auto">
          {folders.map((folder) => (
            <li
              key={folder.id}
              onClick={() => setRootFolderId(folder.id)}
              className={`underline cursor-pointer ${folder.id === rootFolderId ? "opacity-100" : "opacity-40"}`}>
              {folder.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
