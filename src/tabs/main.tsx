import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import type { Bookmark } from "~background"

import "../style.css"

function MainTab() {
  const [activeBookmark, setActiveBookmark] = useState<Bookmark | undefined>()

  useEffect(() => {
    async function fetchActiveBookmark() {
      const response = await sendToBackground({ name: "get-bookmark" })
      if (!response || !response.bookmark) return
      setActiveBookmark(response.bookmark)
    }

    fetchActiveBookmark()
  }, [])

  useEffect(() => {
    if (activeBookmark) {
      window.location.href = activeBookmark.url
    }
  }, [activeBookmark])

  return (
    <div className="bg-[#1E1F20] h-screen m-0 p-0 flex justify-center items-center">
      {activeBookmark === undefined ? (
        <span className="text-white text-lg text-center">
          Could not load bookmark.
        </span>
      ) : (
        <div className="pointer-events-none w-[2.5em] h-[2.5em] border-[0.4em] border-[#353739] border-t-[#555] rounded-[50%] animate-spin" />
      )}
    </div>
  )
}

export default MainTab
