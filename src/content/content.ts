import { create_button, create_element } from "../lib/utils";

const PLAYER_CARD = "ytdg-player-card";

function update(): void {
    if (location.pathname === "/watch") {
        if (document.getElementById("PLAYER_CARD")) return;
        const player = document.getElementById("movie_player");
        if (!player) return;

        const card = create_element({
            id: PLAYER_CARD,
        });
        card.replaceChildren(
            create_element({
                text: "Delayed Gratification — Take a moment before watching.",
            }),
            create_button("Add to Queue"),
        );

        player.replaceChildren(card);
    }
}

window.addEventListener("yt-navigate-finish", () => update());
update();
// const observer = new MutationObserver(() => update());
// observer.observe(document.body, { childList: true, subtree: true });
