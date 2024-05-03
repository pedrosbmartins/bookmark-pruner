export {}

chrome.commands.onCommand.addListener(async (command) => {
  if (command === "start-main-flow") {
    chrome.tabs.update({
      url: "chrome-extension://flkknfhkmjilbcikhlgnleiiemdkmnme/tabs/main.html"
    })
  }
})
