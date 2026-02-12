const form = document.getElementById("settingsForm");
const delayInput = document.getElementById("delay");
const enabledInput = document.getElementById("enabled");
const saveStatus = document.getElementById("saveStatus");

async function loadSettings() {
    const { delay = 5, enabled = true } = await browser.storage.local.get([
        "delay",
        "enabled",
    ]);
    delayInput.value = delay;
    enabledInput.checked = enabled;
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    await browser.storage.local.set({
        delay: Number(delayInput.value),
        enabled: enabledInput.checked,
    });
    saveStatus.classList.remove("hidden");
    setTimeout(() => saveStatus.classList.add("hidden"), 2000);
});

loadSettings();
