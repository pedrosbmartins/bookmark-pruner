export enum Command {
  LOAD_RANDOM_BOOKMARK = "load-random-bookmark"
}

export async function getShortcut(command: Command) {
  const commandList = await chrome.commands.getAll()
  for (let { name, shortcut } of commandList) {
    if (name === Command.LOAD_RANDOM_BOOKMARK) {
      return shortcut
    }
  }
}
