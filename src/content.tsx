import deleteIcon from "data-base64:~../assets/delete.png"
import shuffleIcon from "data-base64:~../assets/shuffle.png"
import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import { type Bookmark } from "~core/bookmarks"
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

export default function Container() {
  const [bookmark, setBookmark] = useState<Bookmark | undefined>()

  useEffect(() => {
    const run = async () => {
      const response = await sendToBackground({ name: "get-bookmark" })
      setBookmark(response.bookmark)
    }

    run()
  }, [])

  const nextBookmark = async () => {
    await sendToBackground({ name: "next-bookmark" })
  }

  if (
    !bookmark ||
    !bookmark.url ||
    !isSameURL(bookmark.url, window.location.href)
  ) {
    return null
  }

  return <Content bookmark={bookmark} onNextBookmark={nextBookmark} />
}

function Content(props: { bookmark?: Bookmark; onNextBookmark: () => void }) {
  const [ageInDays, setAgeInDays] = useState<number | undefined>()
  const [isVisible, setIsVisible] = useState(false)

  const [showRemoveDialog, setShowRemoveDialog] = useState(false)

  useEffect(() => {
    if (!props.bookmark) {
      setIsVisible(false)
      return
    }
    const now = new Date().getTime()
    const added = new Date(props.bookmark?.dateAdded).getTime()
    const differenceInDays = (now - added) / 1000 / 60 / 60 / 24
    setAgeInDays(Math.round(differenceInDays))
    setTimeout(() => setIsVisible(true), 100)
  }, [props.bookmark])

  const onRemoveBookmark = async () => {
    setIsVisible(false)
    await sendToBackground({ name: "remove-bookmark" })
    props.onNextBookmark()
  }

  return (
    <>
      <div
        className={`transition-transform duration-500 ${isVisible ? "translate-y-0" : "translate-y-[500px]"} fixed bg-[#29282D] bottom-4 left-[50%] translate-x-[-50%] text-white flex justify-center rounded-[20px] shadow-[#000_0_1px_5px_0] font-sans`}>
        <div className="rounded-l-[20px] flex text-center justify-center px-6 py-3 cursor-default md:px-12 md:py-6">
          <span className="flex items-center text-nowrap text-[3em] md:text-[4em]">
            <span className="leading-[0.5em]">
              <span className="font-mono">{ageInDays}</span>
              <span className="text-[0.5em] font-thin"> days old</span>
            </span>
          </span>
        </div>
        <div className="flex flex-col">
          <div
            className="rounded-tr-[20px] bg-black/50 flex-1 flex items-center justify-center py-4 px-6 cursor-pointer select-none hover:bg-red-600 active:bg-red-700"
            onClick={() => setShowRemoveDialog(true)}>
            <img
              src={deleteIcon}
              className="w-[40px] aspect-square min-w-[40px]"
              alt="Delete bookmark"
            />
          </div>
          <div
            className="rounded-br-[20px] bg-black/30 flex items-center justify-center py-4 px-6 cursor-pointer select-none hover:bg-blue-500 active:bg-blue-600"
            onClick={() => {
              setIsVisible(false)
              props.onNextBookmark()
            }}>
            <img
              src={shuffleIcon}
              className="w-[24px] aspect-square min-w-[24px]"
              alt="Next bookmark"
            />
          </div>
        </div>
      </div>
      <RemoveBookmarkDialog
        visible={showRemoveDialog}
        onCancel={() => setShowRemoveDialog(false)}
        onRemoveBookmark={onRemoveBookmark}
      />
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
        <div className="text-center py-6 px-12 font-medium text-[1.5em]">
          Permanently remove bookmark?
        </div>
        <div className="flex justify-stretch">
          <div
            className="bg-black/40 flex-1 rounded-bl-[20px] py-3 text-center cursor-pointer hover:bg-blue-500 active:bg-blue-600"
            onClick={props.onCancel}>
            <span className="text-[1.25em]  uppercase">Cancel</span>
          </div>
          <div
            className="bg-black/10 flex-1 rounded-br-[20px] py-3 text-center cursor-pointer hover:bg-red-600 active:bg-red-700"
            onClick={props.onRemoveBookmark}>
            <span className="text-[1.25em]  uppercase">Remove</span>
          </div>
        </div>
      </div>
    </div>
  )
}
