import browser from "webextension-polyfill";
import { QueueItem } from "../lib/utils";

browser.webRequest.onBeforeRequest.addListener(
    async (details) => {
        const tab = await browser.tabs.get(details.tabId);
        if (!tab.url) return { cancel: false };
        const tabUrl = new URL(tab.url);

        console.log(tabUrl);

        if (tabUrl.pathname !== "/watch") return { cancel: false };

        const video_id = tabUrl.searchParams.get("v");
        if (!video_id) return { cancel: false };

        const { queue, delay }: { queue?: QueueItem[]; delay?: number } =
            await browser.storage.local.get(["queue", "delay"]);
        const qitem = queue?.find((item) => item.id === video_id);
        if (!qitem) return { cancel: true };

        return { cancel: qitem.time + delay! > Date.now() };
    },
    { urls: ["*://www.youtube.com/s/player/*/*.js"] },
    ["blocking"],
);

browser.runtime.onInstalled.addListener(async () => {
    const values = {
        delay: 3600_000,
        max_queue: 10,
    };
    const keys = Object.keys(values);
    const existing = await browser.storage.local.getKeys();
    const extra_keys = keys.filter((key) => !existing.includes(key));
    if (extra_keys.length > 0) {
        const to_set = Object.fromEntries(
            Object.entries(values).filter(([key]) => !existing.includes(key)),
        );
        await browser.storage.local.set(to_set);
    }
});
