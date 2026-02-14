import {
    add_to_queue,
    create_button,
    create_element,
    pretty_time,
    QueueItem,
} from "../lib/utils";
import browser from "webextension-polyfill";

const PLAYER_CARD = "ytdg-player-card";

let url = window.location.href;
async function update() {
    console.log("update");
    if (location.pathname === "/watch") {
        if (url !== window.location.href) {
            url = window.location.href;
            location.reload();
        }

        const player = document.getElementById("movie_player");
        if (!player) return;
        let video_id = new URLSearchParams(document.location.search).get("v")!;
        let card = document.getElementById(PLAYER_CARD);

        let { queue, delay }: { queue?: QueueItem[]; delay?: number } =
            await browser.storage.local.get(["queue", "delay"]);
        let try_find = queue?.find((item) => item.id === video_id);

        if (try_find && try_find.time + delay! < Date.now()) {
            // video is ready to play!
            if (card) location.reload();
        } else if (try_find) {
            // video is queued but not ready
            activate_play_supressor();
            start_interval();
            if (!card) card = create_element({ id: PLAYER_CARD });
            card.innerText = pretty_time(try_find.time - Date.now() + delay!);
            player.replaceChildren(card);
        } else if (!card) {
            // video is not queued
            activate_play_supressor();
            card = card_add(video_id);
            player.replaceChildren(card);
        }
    } else url = window.location.href;
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

let interval_id: number | null = null;

function start_interval() {
    if (interval_id !== null) return;
    interval_id = window.setInterval(update, 500);
}

function stop_interval() {
    if (interval_id !== null) {
        clearInterval(interval_id);
        interval_id = null;
    }
}

function activate_play_supressor() {
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
