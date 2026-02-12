import browser from "webextension-polyfill";

document.getElementById("openSettings")!.addEventListener("click", () => {
  browser.runtime.openOptionsPage();
});
