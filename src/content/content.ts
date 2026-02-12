import { create_element } from "../lib/utils";

const CARD_ID = "ytdg-player-card";

function update(): void {
    if (location.pathname === "/watch") {
        const player = document.getElementById("movie_player");
        if (!player || document.getElementById(CARD_ID)) return;

        const card = create_element({
            id: CARD_ID,
            text: "Delayed Gratification — Take a moment before watching.",
        });

        player.replaceWith(card);
    }
}

update();
const observer = new MutationObserver(() => update());
observer.observe(document.body, { childList: true, subtree: true });
window.addEventListener("yt-navigate-finish", () => update());
