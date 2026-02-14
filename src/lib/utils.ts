import browser from "webextension-polyfill";

export function create_element(opts?: {
    tag?: string;
    text?: string;
    id?: string;
}): HTMLElement {
    const element = document.createElement(opts?.tag || "div");
    element.textContent = opts?.text || "";
    element.id = opts?.id || "";
    return element;
}

export function create_button(
    text: string,
    opts?: { id?: string; callback?: () => void },
): HTMLButtonElement {
    const button = document.createElement("button");
    button.textContent = text;
    button.id = opts?.id || "";
    if (opts?.callback) {
        button.addEventListener("click", opts.callback);
    }
    return button;
}

export type QueueItem = {
    id: string;
    time: number;
};

export async function add_to_queue(id: string) {
    let { queue, max_queue, delay }: { queue?: QueueItem[]; max_queue?: number; delay?: number } =
        await browser.storage.local.get(["queue", "max_queue", "delay"]);

    if (!queue) queue = [];
    queue.push({ id, time: Date.now() + (delay || 5000) });
    if (max_queue && queue.length > max_queue) {
        queue.sort((a, b) => a.time - b.time);
        queue = queue.slice(0, max_queue);
    }

    await browser.storage.local.set({ queue });
}

export function pretty_time(time: number): string {
    if (time < 0) return "00:00:00";
    const seconds = Math.floor(time / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    const minutesStr = minutes % 60;
    const secondsStr = seconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutesStr.toString().padStart(2, "0")}:${secondsStr.toString().padStart(2, "0")}`;
}
