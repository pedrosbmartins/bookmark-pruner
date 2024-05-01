import deleteWhiteIcon from "data-base64:~assets/delete-white.png"
import rightArrowWhiteIcon from "data-base64:~assets/right-arrow-white.png"
import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const SCROLL_EPSILON = 100

const scrollMaxValue = () => {
  const body = document.body
  const html = document.documentElement

  const documentHeight = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight
  )

  const windowHeight = window.innerHeight

  return documentHeight - windowHeight
}

// Hey, now is a good time to read and ditch this!
// Who are you kidding? You're not gonna read this over the weekend!

const CustomButton = () => {
  const [targetURL, setTargetURL] = useState<string | undefined>()
  const [daysSinceAdded, setDaysSinceAdded] = useState(0)

  const [fullScrollAchieved, setFullScrollAchieved] = useState(true)

  const handleScroll = () => {
    if (fullScrollAchieved) return
    const position = window.scrollY
    console.log("[scroll]", position, scrollMaxValue())
    if (scrollMaxValue() - window.scrollY <= SCROLL_EPSILON) {
      setFullScrollAchieved(true)
    }
  }

  useEffect(() => {
    async function fetchActiveBookmark() {
      const response = await sendToBackground({ name: "bookmark" })
      if (!response || !response.bookmark) return
      setTargetURL(response.bookmark.url)
      const now = new Date().getTime()
      const added = new Date(response.bookmark.dateAdded).getTime()
      const differenceInDays = (now - added) / 1000 / 60 / 60 / 24
      setDaysSinceAdded(differenceInDays)
    }
    fetchActiveBookmark()

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  if (!targetURL || targetURL !== window.location.href) {
    return null
  }

  return (
    <div className="fixed bg-[#1E1F20] bottom-0 left-[50%] translate-x-[-50%] text-white py-8 px-10 flex justify-center rounded-t-[30px] shadow-[#000_0_-1px_10px_0]">
      <div className="text-center mr-5 pr-10 border-r-[1px] border-r-stone-700 text-stone-100 cursor-default">
        <h1 className="text-[1em]">
          Who are you kidding? You're not gonna read this over the weekend!
        </h1>
        <div className="flex justify-center items-center">
          {daysSinceAdded > 365 ? (
            <div className="bg-red-600 w-2 h-2 rounded-[4px] mr-2"></div>
          ) : daysSinceAdded > 90 ? (
            <div className="bg-yellow-600 w-2 h-2 rounded-[4px] mr-2"></div>
          ) : (
            <div className="bg-green-600 w-2 h-2 rounded-[4px] mr-2"></div>
          )}
          <span className="text-[0.9em] text-stone-500">
            {Math.floor(daysSinceAdded)} days old
          </span>
        </div>
      </div>
      <button
        className="border-none border-[4px] px-5 py-2 uppercase opacity-75 hover:opacity-100"
        onClick={() => alert("Ditch this bookmark?")}>
        <img src={deleteWhiteIcon} className="w-8 h-8" alt="Ditch" />
      </button>
      <button
        className="border-none border-[4px] px-5 py-2 uppercase opacity-75 hover:opacity-100 disabled:opacity-25"
        disabled={!fullScrollAchieved}
        onClick={async () => {
          await sendToBackground({ name: "start" })
        }}>
        <img src={rightArrowWhiteIcon} className="w-8 h-8" alt="Next" />
      </button>
    </div>
  )
}

export default CustomButton
