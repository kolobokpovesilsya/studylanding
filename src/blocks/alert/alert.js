export function getAlertElement(text, type) {
    let iconId = "info-circle";
    switch (type) {
        case "success":
            iconId = "check-circle-filled";
            break;
        case "danger":
            iconId = "exclamation-triangle";
            break;
    }
    const element = document.createElement("div");
    element.classList.add(`alert`);
    element.classList.add(`alert--${type}`);
    const iconBox = document.createElement("div");
    iconBox.classList.add("alert__icon");
    iconBox.innerHTML = `<svg class="alert__icon-svg"><use href="sprites.svg#${iconId}"></use><svg>`;

    element.appendChild(iconBox);
    const message = document.createElement("p");
    message.textContent = text;
    element.appendChild(message);
    return element;
}
