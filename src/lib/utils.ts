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
