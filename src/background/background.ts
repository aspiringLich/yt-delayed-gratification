import browser from "webextension-polyfill";

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
            Object.entries(values).filter(([key]) => !existing.includes(key))
        );
        await browser.storage.local.set(to_set);
    }
});
