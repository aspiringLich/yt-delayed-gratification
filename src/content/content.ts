import {
    add_to_queue,
    create_button,
    create_element,
    pretty_time,
    QueueItem,
} from "../lib/utils";
import browser from "webextension-polyfill";

const PLAYER_CARD = "ytdg-player-card";

async function update() {
    if (location.pathname === "/watch") {
        const player = document.getElementById("movie_player");
        if (!player) return;
        let video_id = new URLSearchParams(document.location.search).get("v")!;
        let card = document.getElementById(PLAYER_CARD);

        let { queue }: { queue?: QueueItem[] } =
            await browser.storage.local.get("queue");

        let try_find = queue?.find((item) => item.id === video_id);
        if (try_find && try_find.time < Date.now()) {
            if (card) location.reload();
            else return;
        } else if (try_find) {
            card = card_timer(try_find);
            start_interval();
        } else {
            card = card_add(video_id);
            setTimeout(update, 500);
        }
        
        activate_play_supressor();
        player.replaceChildren(card);
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
                activate_play_supressor();
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
    interval_id = window.setInterval(update, 1000);
}

function stop_interval() {
    if (interval_id !== null) {
        clearInterval(interval_id);
        interval_id = null;
    }
}

let suppressed_video: HTMLVideoElement | null = null;

function pause_player() {
    console.log("pause_player")
    let player = document.getElementById("movie_player") as HTMLElement & { pauseVideo: () => void } | null;
    player?.pauseVideo();
}

function activate_play_supressor() {
    let video: HTMLVideoElement | null = document.querySelector("video.video-stream.html5-main-video");
    if (!video) {
        setTimeout(activate_play_supressor, 100);
        return;
    }
    
    if (suppressed_video === video) return;
    
    if (suppressed_video) {
        suppressed_video.removeEventListener("play", pause_player);
        suppressed_video.removeEventListener("playing", pause_player);
    }
    
    suppressed_video = video;
    video.addEventListener("play", pause_player);
    video.addEventListener("playing", pause_player);
}

window.addEventListener("yt-page-type-changed", update);
window.addEventListener("yt-page-data-updated", update);
window.addEventListener("yt-navigate", () => {
    stop_interval();
    update();
});
window.addEventListener("yt-navigate-start", update);
window.addEventListener("yt-navigate-finish", update);
update();
// const observer = new MutationObserver(() => update());
// observer.observe(document.body, { childList: true, subtree: true });
