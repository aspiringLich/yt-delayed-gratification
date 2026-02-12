const CARD_ID = "ytdg-player-card";

function is_watch_page() {
    return location.pathname === "/watch";
}

function update() {
    if (location.pathname === "/watch") {
        const player = document.getElementById("movie_player");
        if (!player || document.getElementById(CARD_ID)) return;

        const card = document.createElement("div");
        card.id = CARD_ID;
        card.textContent =
            "Delayed Gratification — Take a moment before watching.";

        player.replaceWith(card);
    }
}

update();
const observer = new MutationObserver(() => update());
observer.observe(document.body, { childList: true, subtree: true });
window.addEventListener("yt-navigate-finish", () => update());
