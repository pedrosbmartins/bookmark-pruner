import deleteWhiteIcon from "data-base64:~../assets/delete-white.png"
import rightArrowWhiteIcon from "data-base64:~../assets/right-arrow-white.png"
import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import type { Bookmark } from "~background"
import { isSameURL } from "~utils"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

enum BookmarkAge {
  Level1 = "Level1",
  Level2 = "Level2",
  Level3 = "Level3",
  Level4 = "Level4"
}

const commonPhrases = [
  "Read it or ditch it!",
  "Who are you kidding? You're not gonna read this over the weekend!"
]

const phrases: Record<BookmarkAge, string[]> = {
  [BookmarkAge.Level1]: [
    "Freshly cooked. Dive in!",
    "This one is barely out of the oven."
  ],
  [BookmarkAge.Level2]: [],
  [BookmarkAge.Level3]: [
    "This has been here for a while. Keep it or ditch it?"
  ],
  [BookmarkAge.Level4]: [
    "This has been here for a while. Keep it or ditch it?",
    "Straight from the Jurassic period",
    "This one's just gatheting dust, isn't it?",
    "This has survived longer than most plants in your care. Revive or ditch?"
  ]
}

const colors: Record<BookmarkAge, string> = {
  [BookmarkAge.Level1]: "bg-green-600",
  [BookmarkAge.Level2]: "bg-yellow-600",
  [BookmarkAge.Level3]: "bg-orange-600",
  [BookmarkAge.Level4]: "bg-red-600"
}

const MainContent = () => {
  const [bookmark, setBookmark] = useState<Bookmark | undefined>()

  const [ageLevel, setAgeLevel] = useState(BookmarkAge.Level1)
  const [ageLabel, setAgeLabel] = useState("")
  const [randomPhrase, setRandomPhrase] = useState("")

  const [showDialog, setShowDialog] = useState(false)

  useEffect(() => {
    async function fetchActiveBookmark() {
      const response = await sendToBackground({ name: "get-bookmark" })
      if (!response || !response.bookmark) return
      onBookmarkLoaded(response.bookmark)
    }

    fetchActiveBookmark()
  }, [])

  function onBookmarkLoaded(bookmark: Bookmark) {
    setBookmark(bookmark)
    const now = new Date().getTime()
    const added = new Date(bookmark.dateAdded).getTime()
    const differenceInDays = (now - added) / 1000 / 60 / 60 / 24

    const level =
      differenceInDays <= 14
        ? BookmarkAge.Level1
        : differenceInDays <= 30
          ? BookmarkAge.Level2
          : differenceInDays <= 180
            ? BookmarkAge.Level3
            : BookmarkAge.Level4
    setAgeLevel(level)

    const agePhrases = [...commonPhrases, ...phrases[level]]
    const randomIndex = Math.floor(Math.random() * agePhrases.length)
    setRandomPhrase(agePhrases[randomIndex])

    setAgeLabel(buildAgeLabel(differenceInDays))
  }

  async function nextBookmark() {
    await sendToBackground({ name: "start" })
  }

  async function onDitchBookmark() {
    await sendToBackground({ name: "ditch", body: { bookmarkId: bookmark.id } })
    setShowDialog(false)
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
      <div className="fixed bg-[#1E1F20] bottom-0 left-[50%] translate-x-[-50%] text-white py-8 px-10 flex justify-center rounded-t-[30px] shadow-[#000_0_-1px_10px_0]">
        <div className="text-center mr-5 pr-10 border-r-[1px] border-r-stone-700 text-stone-100 cursor-default">
          <h1 className="text-[1em]">{randomPhrase}</h1>
          <div className="flex justify-center items-center">
            <div
              className={`${colors[ageLevel]} w-2 h-2 rounded-[4px] mr-2`}></div>
            <span className="text-[0.9em] text-stone-500">{ageLabel}</span>
          </div>
        </div>
        <button
          className="border-none border-[4px] px-5 py-2 uppercase opacity-75 hover:opacity-100"
          onClick={() => setShowDialog(true)}>
          <img src={deleteWhiteIcon} className="w-8 h-8" alt="Ditch" />
        </button>
        <button
          className="border-none border-[4px] px-5 py-2 uppercase opacity-75 hover:opacity-100 disabled:opacity-25"
          onClick={() => nextBookmark()}>
          <img src={rightArrowWhiteIcon} className="w-8 h-8" alt="Next" />
        </button>
      </div>
      <div
        className={`fixed top-0 left-0 inset-0 w-screen h-screen bg-[rgba(0,0,0,0.9)] flex justify-center items-center ${showDialog ? "visible" : "hidden"}`}
        onClick={() => setShowDialog(false)}>
        <div className="bg-[#1E1F20] text-white py-8 px-8 flex flex-col justify-center rounded-[30px] shadow-[#000_0_-1px_10px_0]">
          <div>Ditch this bookmark?</div>
          <ul className="flex justify-end gap-4 pt-2 items-baseline">
            <li>
              <button
                className="underline opacity-80 hover:opacity-100"
                onClick={() => setShowDialog(false)}>
                No
              </button>
            </li>
            <li>
              <button
                className="bg-[rgba(0,0,0,0.75)] rounded-[30px] px-5 py-2 opacity-80 hover:opacity-100"
                onClick={() => onDitchBookmark()}>
                Yes
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

function buildAgeLabel(daysSinceAdded: number) {
  const config = ageLabelConfig(daysSinceAdded)
  const value = Math.floor(daysSinceAdded / config.divider)
  const label = value === 1 ? config.label : `${config.label}s`
  return `${value} ${label} old`
}

// prettier-ignore
function ageLabelConfig(daysSinceAdded: number) {
  switch (true) {
    case daysSinceAdded <  14: return labelConfig.days
    case daysSinceAdded <  30: return labelConfig.weeks
    case daysSinceAdded < 365: return labelConfig.months
    default:                   return labelConfig.years
  }
}

const labelConfig = {
  days: { divider: 1, label: "day" },
  weeks: { divider: 7, label: "week" },
  months: { divider: 30, label: "month" },
  years: { divider: 365, label: "year" }
}

export default MainContent
