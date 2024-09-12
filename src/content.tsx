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
  const [showRemoveDialog, setShowRemoveDialog] = useState(false)

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

  const nextBookmark = async () => {
    await sendToBackground({ name: "next-bookmark" })
  }

  const onRemoveBookmark = async () => {
    await sendToBackground({ name: "remove-bookmark" })
    await nextBookmark()
  }

  if (
    !bookmark ||
    !bookmark.url ||
    !isSameURL(bookmark.url, window.location.href)
  ) {
    return null
  }

  return (
    <>
      <div className="fixed bg-[#29282D] bottom-4 left-[50%] translate-x-[-50%] text-white flex justify-center rounded-[20px] shadow-[#000_0_1px_5px_0] font-sans">
        {isLoading ? (
          <Spinner />
        ) : (
          <Content
            bookmark={bookmark}
            onNextBookmark={nextBookmark}
            onRemoveBookmark={() => setShowRemoveDialog(true)}
          />
        )}
      </div>
      <RemoveBookmarkDialog
        visible={showRemoveDialog}
        onCancel={() => setShowRemoveDialog(false)}
        onRemoveBookmark={onRemoveBookmark}
      />
    </>
  )
}

function Spinner() {
  return (
    <div className="pointer-events-none w-[2.5em] h-[2.5em] border-[0.1em] border-[#353739] border-t-[#cacaca] rounded-[50%] animate-spin mx-12 my-6" />
  )
}

function Content(props: {
  bookmark?: Bookmark
  onNextBookmark: () => void
  onRemoveBookmark: () => void
}) {
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

  return (
    <>
      <div className="transition-all rounded-l-[20px] flex text-center justify-center px-6 py-3 cursor-default md:px-12 md:py-6">
        <span className="flex items-center text-nowrap text-[3em] md:text-[4em]">
          <span className="leading-[0.5em]">
            <span className="font-mono">{ageInDays}</span>
            <span className="text-[0.5em] font-thin"> days old</span>
          </span>
        </span>
      </div>
      <div className="flex flex-col">
        <div
          className="rounded-tr-[20px] bg-black/50 flex-1 flex items-center justify-center py-4 px-6 cursor-pointer select-none hover:bg-red-600"
          onClick={props.onRemoveBookmark}>
          <img
            src={deleteIcon}
            className="w-[40px] aspect-square min-w-[40px]"
            alt="Delete bookmark"
          />
        </div>
        <div
          className="rounded-br-[20px] bg-black/30 flex items-center justify-center py-4 px-6 cursor-pointer select-none hover:bg-black/10"
          onClick={props.onNextBookmark}>
          <img
            src={shuffleIcon}
            className="w-[24px] aspect-square min-w-[24px]"
            alt="Next bookmark"
          />
        </div>
      </div>
    </>
  )
}

function RemoveBookmarkDialog(props: {
  visible: boolean
  onCancel: () => void
  onRemoveBookmark: () => {}
}) {
  return (
    <div
      className={`fixed top-0 left-0 inset-0 w-screen h-screen bg-[rgba(0,0,0,0.85)] flex justify-center items-center ${props.visible ? "visible" : "hidden"}`}
      onClick={props.onCancel}>
      <div className="bg-[#131216] text-white flex flex-col justify-center rounded-[20px] shadow-[#000_0_1px_5px_0] select-none cursor-default">
        <div className="text-center py-6 px-12 font-medium">
          Permanently remove bookmark?
        </div>
        <div className="flex justify-stretch">
          <div
            className="bg-black/40 flex-1 rounded-bl-[20px] py-3 px-12 cursor-pointer hover:bg-black/20"
            onClick={props.onCancel}>
            <span className="text-[1.5em] font-medium">Cancel</span>
          </div>
          <div
            className="bg-black/10 flex-1 rounded-br-[20px] py-3 px-12 cursor-pointer hover:bg-red-600"
            onClick={props.onRemoveBookmark}>
            <span className="text-[1.5em] font-medium">Remove</span>
          </div>
        </div>
      </div>
    </div>
  )
}
