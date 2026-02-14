import browser from "webextension-polyfill";

const hoursInput = document.getElementById("hours") as HTMLInputElement;
const minutesInput = document.getElementById("minutes") as HTMLInputElement;
const maxQueueInput = document.getElementById("max_queue") as HTMLInputElement;

function validate(input: HTMLInputElement): boolean {
    const val = Number(input.value);
    const valid =
        input.value !== "" &&
        Number.isInteger(val) &&
        val >= Number(input.min) &&
        val <= Number(input.max);
    input.classList.toggle("invalid", !valid);
    return valid;
}

function delayFromInputs(): number {
    return Number(hoursInput.value) * 3600_000 + Number(minutesInput.value) * 60_000;
}

async function loadSettings(): Promise<void> {
    const { delay = 0, max_queue = 10 } = await browser.storage.local.get([
        "delay",
        "max_queue",
    ]);
    const totalMinutes = Math.floor(Number(delay) / 60_000);
    hoursInput.value = String(Math.floor(totalMinutes / 60));
    minutesInput.value = String(totalMinutes % 60);
    maxQueueInput.value = String(max_queue);
}

for (const input of [hoursInput, minutesInput]) {
    input.addEventListener("input", () => {
        if (validate(hoursInput) && validate(minutesInput)) {
            browser.storage.local.set({ delay: delayFromInputs() });
        }
    });
}

maxQueueInput.addEventListener("input", () => {
    if (validate(maxQueueInput)) {
        browser.storage.local.set({ max_queue: Number(maxQueueInput.value) });
    }
});

loadSettings();
