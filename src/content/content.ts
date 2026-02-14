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
    console.log("update")
    if (location.pathname === "/watch") {
        const player = document.getElementById("movie_player");
        if (!player) return;
        let video_id = new URLSearchParams(document.location.search).get("v")!;
        let card = document.getElementById(PLAYER_CARD);

        let { queue }: { queue?: QueueItem[] } =
            await browser.storage.local.get("queue");
        
        // this is really ugly
        let try_find = queue?.find((item) => item.id === video_id);
        if (try_find && try_find.time < Date.now()) {
            if (card) location.reload();
            else return;
        } else if (try_find) {
            start_interval();
            if (!card) card = card_timer(try_find);
            else {
                card.innerHTML = pretty_time(try_find.time - Date.now());
                return;
            }
        } else if (!card) {
            card = card_add(video_id);
        } else {
            return;
        }
        
        if (url !== window.location.href) {
            url = window.location.href;
            location.reload();
        }

        activate_play_supressor();
        player.replaceChildren(card);
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

function card_timer(item: QueueItem): HTMLElement {
    const card = create_element({ id: PLAYER_CARD });

    if (item.time < Date.now()) {
        location.reload();
    }
    card.replaceChildren(
        create_element({ text: pretty_time(item.time - Date.now()) }),
    );
    return card;
}

let interval_id: number | null = null;

function start_interval() {
    if (interval_id !== null) return;
    interval_id = window.setInterval(update, 450);
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
        ``;
        v.querySelectorAll("source").forEach((s) => s.remove());
        v.load();
    });
}

window.addEventListener("yt-navigate-start", update);
window.addEventListener("yt-navigate-finish", update);
update();
// const observer = new MutationObserver(() => update());
// observer.observe(document.body, { childList: true, subtree: true });
