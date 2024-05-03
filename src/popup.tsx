import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import "./style.css"

function IndexPopup() {
  const [mainShortcut, setMainShortcut] = useState("No shortcut")

  useEffect(() => {
    chrome.commands.getAll((commands) => {
      for (let { name, shortcut } of commands) {
        if (name === "start-main-flow") {
          setMainShortcut(shortcut)
        }
      }
    })
  }, [])

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
          <span className="block font-mono">Other bookmarks</span>
          <button className="underline">Change</button>
        </div>
      </div>
    </div>
  )
}

export default IndexPopup
