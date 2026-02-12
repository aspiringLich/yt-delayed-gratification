import browser from "webextension-polyfill";

browser.runtime.onInstalled.addListener(() => {
    browser.storage.local.set({ delay: 5, enabled: true });
    console.log("YT Delayed Gratification installed");
});
