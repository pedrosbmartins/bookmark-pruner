import type { Bookmark } from "./bookmarks"

export enum Status {
  ready = "ready",
  loading = "loading",
  failed = "failed"
}

interface ReadyMessage {
  status: Status.ready
  bookmark: Bookmark
}

interface LoadingMessage {
  status: Status.loading
}

interface FailedMessage {
  status: Status.failed
  error: any
}

export type Message = ReadyMessage | LoadingMessage | FailedMessage

export function buildLoadingMessage(): LoadingMessage {
  return { status: Status.loading }
}

export function buildReadyMessage(bookmark: Bookmark): ReadyMessage {
  return { status: Status.ready, bookmark }
}

export function buildFailedMessage(error: any): FailedMessage {
  return { status: Status.failed, error }
}
