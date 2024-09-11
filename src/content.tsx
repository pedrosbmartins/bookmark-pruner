import deleteIcon from "data-base64:~../assets/delete.png"
import shuffleIcon from "data-base64:~../assets/shuffle.png"
import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import { type Bookmark } from "~core/bookmarks"
import { Status, type Message } from "~core/messaging"
import { isSameURL } from "~utils"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true,
  css: ["font.css"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export default function MainContent() {
  const [isLoading, setIsLoading] = useState(true)
  const [bookmark, setBookmark] = useState<Bookmark | undefined>()

  useEffect(() => {
    const onMessage = (message: Message) => {
      const { status } = message
      setIsLoading(status === Status.loading)
    }

    chrome.runtime.onMessage.addListener(onMessage)

    const run = async () => {
      const response = await sendToBackground({ name: "get-bookmark" })
      setBookmark(response.bookmark)
      setIsLoading(false)
    }

    run()

    return () => chrome.runtime.onMessage.removeListener(onMessage)
  }, [])

  if (
    !bookmark ||
    !bookmark.url ||
    !isSameURL(bookmark.url, window.location.href)
  ) {
    return null
  }

  return (
    <div className="fixed bg-[#29282D] bottom-4 left-[50%] translate-x-[-50%] text-white flex justify-center rounded-[20px] shadow-[#000_0_1px_5px_0] font-sans">
      {isLoading ? <Spinner /> : <Content bookmark={bookmark} />}
    </div>
  )
}

function Spinner() {
  return (
    <div className="pointer-events-none w-[2.5em] h-[2.5em] border-[0.1em] border-[#353739] border-t-[#cacaca] rounded-[50%] animate-spin mx-12 my-6" />
  )
}

function Content(props: { bookmark?: Bookmark }) {
  const [ageInDays, setAgeInDays] = useState<number | undefined>()

  useEffect(() => {
    if (!props.bookmark) {
      return
    }
    const now = new Date().getTime()
    const added = new Date(props.bookmark?.dateAdded).getTime()
    const differenceInDays = (now - added) / 1000 / 60 / 60 / 24
    setAgeInDays(Math.round(differenceInDays))
  }, [props.bookmark])

  const nextBookmark = async () => {
    await sendToBackground({ name: "next-bookmark" })
  }

  return (
    <>
      <div className="transition-all rounded-l-[20px] flex text-center justify-center px-12 py-6 cursor-default">
        <span className="text-[4em] block">
          <span className="font-mono">{ageInDays}</span>
          <span className="text-[0.5em] font-thin"> days ago</span>
        </span>
      </div>
      <div className="flex flex-col">
        <div className="rounded-tr-[20px] bg-black/50 flex-1 flex items-center justify-center py-4 px-6 cursor-pointer hover:bg-red-600">
          <img
            src={deleteIcon}
            className="w-[40px] aspect-square"
            alt="Delete bookmark"
          />
        </div>
        <div
          className="rounded-br-[20px] bg-black/30 flex items-center justify-center py-4 px-6 cursor-pointer hover:bg-black/10"
          onClick={nextBookmark}>
          <img
            src={shuffleIcon}
            className="w-[24px] aspect-square"
            alt="Next bookmark"
          />
        </div>
      </div>
    </>
  )
}
