import browser from "webextension-polyfill";

const form = document.getElementById("settingsForm") as HTMLFormElement;
const delayInput = document.getElementById("delay") as HTMLInputElement;
const enabledInput = document.getElementById("enabled") as HTMLInputElement;
const saveStatus = document.getElementById("saveStatus")!;

async function loadSettings(): Promise<void> {
    const { delay = 5, enabled = true } = await browser.storage.local.get([
        "delay",
        "enabled",
    ]);
    delayInput.value = String(delay);
    enabledInput.checked = Boolean(enabled);
}

form.addEventListener("submit", async (e: Event) => {
    e.preventDefault();
    await browser.storage.local.set({
        delay: Number(delayInput.value),
        enabled: enabledInput.checked,
    });
    saveStatus.classList.remove("hidden");
    setTimeout(() => saveStatus.classList.add("hidden"), 2000);
});

loadSettings();
