import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import { listAllBookmarkFolders } from "~core/bookmarks"
import { Command, getShortcut } from "~core/commands"
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

  async function setupShortcuts() {
    const shortcut = await getShortcut(Command.LOAD_RANDOM_BOOKMARK)
    setShortcut(shortcut)
  }

  async function setupFolders() {
    const allFolders = await listAllBookmarkFolders()
    setFolders(allFolders)
  }

  async function setupRootFolder() {
    const id = await getRootBookmarkNodeId()
    setRootFolderId(id)
  }

  const onNextBookmark = async () => {
    await sendToBackground({ name: "next-bookmark" })
  }

  return (
    <div className="w-[300px] bg-[#29282D] text-white text-[1.2em]">
      <div className="bg-[rgba(0,0,0,0.25)] p-4 flex flex-col items-center">
        <h2 className="text-md text-center text-gray-100 font-mono">
          Bookmark Pruner
        </h2>
        <button
          className="w-[80%] my-2 py-2 bg-blue-500 rounded-md uppercase font-bold font-mono active:bg-blue-600"
          onClick={onNextBookmark}>
          Random bookmark
        </button>
        <span className="text-center text-[0.9em] text-gray-400">
          {shortcut}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-bold mb-1">Root folder</h3>
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
      <div className="bg-[rgba(255,255,255,0.05)] py-2 px-4 flex text-[1em] cursor-pointer hover:bg-[rgba(255,255,255,0.1)]">
        <h3 className="mb-1 text-[rgba(255,255,255,0.5)] font-thin">About</h3>
      </div>
    </div>
  )
}
