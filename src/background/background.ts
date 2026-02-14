import browser from "webextension-polyfill";

browser.runtime.onInstalled.addListener(async () => {
    if (!(await browser.storage.local.get("init")).init) {
        await browser.storage.local.set({ delay: 3600_000, max_queue: 10, init: true });
    }
});
