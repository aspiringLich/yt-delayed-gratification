import {
    add_to_queue,
    create_button,
    create_element,
    pretty_time,
    QueueItem,
} from "../lib/utils";
import browser from "webextension-polyfill";

const PLAYER_CARD = "ytdg-player-card";
const QUEUE_CARD = "ytdg-queue-card";

let url = window.location.href;
async function update() {
    console.debug("update");

    let href_changed = url !== window.location.href;
    url = window.location.href;

    if (location.pathname === "/watch") {
        // if the url has changed, reload. Full reload is needed to disable the video players.
        if (href_changed) location.reload();

        const player = document.getElementById("movie_player");
        if (!player) return;
        let video_id = new URLSearchParams(document.location.search).get("v")!;
        let card = document.getElementById(PLAYER_CARD);

        let { queue, delay }: { queue?: QueueItem[]; delay?: number } =
            await browser.storage.local.get(["queue", "delay"]);
        let qitem = queue?.find((item) => item.id === video_id);

        if (qitem && qitem.time + delay! < Date.now()) {
            // video is ready to play!
            if (card) location.reload();
        } else if (qitem) {
            // video is queued but not ready
            suppress_video();
            start_interval();
            if (!card) card = create_element({ id: PLAYER_CARD });
            card.innerText = pretty_time(qitem.time - Date.now() + delay!);
            player.replaceChildren(card);
        } else if (!card) {
            // video is not queued
            suppress_video();
            card = card_add(video_id);
            player.replaceChildren(card);
        }
    } else if (location.pathname == "/") {
        if (href_changed) location.reload();

        const contents = document.getElementById("contents");
        if (!contents) return;

        let card = document.getElementById(QUEUE_CARD);
        if (!card) {
            card = await queue_card();
            console.debug(card);
            if (card) contents.parentElement!.insertBefore(card, contents);
            else console.error("Failed to create queue card");
        }
    }
}

function card_add(video_id: string): HTMLElement {
    const card = create_element({ id: PLAYER_CARD });

    card.replaceChildren(
        create_element({
            text: "Delayed Gratification — Take a moment before watching.",
        }),
        create_button("Add to Queue", {
            callback: () => {
                add_to_queue(video_id);
                start_interval();
            },
        }),
    );
    return card;
}

async function queue_card(): Promise<HTMLElement | null> {
    let { queue, delay }: { queue?: QueueItem[]; delay?: number } =
        await browser.storage.local.get(["queue", "delay"]);

    if (!queue?.length) return null;

    const card = create_element({ id: QUEUE_CARD });
    const title = create_element({ tag: "h2", text: "Queue" });
    card.appendChild(title);

    const queue_el = create_element({ id: "-ytdg-queue" });
    card.appendChild(queue_el);

    for (const item of queue) {
        const time_remaining = item.time + delay! - Date.now();

        const thumb = create_element({
            tag: "img",
            src: `https://img.youtube.com/vi/${item.id}/mqdefault.jpg`,
        });
        const entry = create_element({ id: "-ytdg-queue-entry" });

        if (time_remaining > 0) {
            const label = create_element({
                tag: "span",
                text: pretty_time(time_remaining),
                id: "-ytdg-queue-entry-time",
            });
            entry.replaceChildren(thumb, label);
        } else {
            entry.replaceChildren(thumb);
        }
        queue_el.appendChild(entry);
    }
    return card;
}

let interval_id: number | null = null;
function start_interval() {
    if (interval_id !== null) return;
    interval_id = window.setInterval(update, 500);
}

function suppress_video() {
    document.querySelectorAll<HTMLVideoElement>("video").forEach((v) => {
        v.removeAttribute("src");
        v.querySelectorAll("source").forEach((s) => s.remove());
        v.load();
    });
}

window.addEventListener("yt-navigate-start", update);
window.addEventListener("yt-navigate", update);
window.addEventListener("yt-navigate-finish", update);
update();
// const observer = new MutationObserver(() => update());
// observer.observe(document.body, { childList: true, subtree: true });
