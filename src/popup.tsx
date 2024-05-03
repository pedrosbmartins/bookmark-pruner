import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

import "./style.css"

interface BookmarkFolder {
  id: string
  title: string
}

const storage = new Storage()

function IndexPopup() {
  const [mainShortcut, setMainShortcut] = useState("No shortcut")
  const [rootFolderId, setRootFolderId] = useState("2")
  const [folders, setFolders] = useState<BookmarkFolder[]>([])

  useEffect(() => {
    setupShortcuts()
    setupFolders()
    setupRootFolder()
  }, [])

  useEffect(() => {
    storage.set("rootBookmarkNodeId", rootFolderId)
  }, [rootFolderId])

  function setupShortcuts() {
    chrome.commands.getAll((commands) => {
      for (let { name, shortcut } of commands) {
        if (name === "start-main-flow") {
          setMainShortcut(shortcut)
        }
      }
    })
  }

  async function setupFolders() {
    const root = (await chrome.bookmarks.getTree())[0]
    const rootFolder = { id: "0", title: "Root" }
    let folders = [rootFolder]
    folders = [...folders, ...mapFolders(root.children)]
    setFolders(folders)
  }

  function mapFolders(children: chrome.bookmarks.BookmarkTreeNode[]) {
    return children
      .filter((node) => node.children.length !== 0)
      .map((node) => ({ id: node.id, title: node.title }))
  }

  async function setupRootFolder() {
    const id = await storage.get("rootBookmarkNodeId")
    setRootFolderId(id ?? "2")
  }

  return (
    <div className="w-[200px] p-4">
      <h2 className="text-lg">Ditch me</h2>
      <div className="mt-2 text-[1.2em]">
        <button
          className="underline my-1 block"
          onClick={async () => {
            await sendToBackground({ name: "start" })
          }}>
          Start
        </button>
        <span className="my-1 text-[0.9em]">{mainShortcut}</span>
        <div className="my-2">
          <h3 className="font-bold">Root folder</h3>
          <ul className="font-mono">
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
    </div>
  )
}

export default IndexPopup
