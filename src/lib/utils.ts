interface CreateElementOptions {
  tag?: string;
  text?: string;
  id?: string;
}

export function create_element({
  tag = "div",
  text = "",
  id = "",
}: CreateElementOptions): HTMLElement {
  const element = document.createElement(tag);
  element.textContent = text;
  element.id = id;
  return element;
}
