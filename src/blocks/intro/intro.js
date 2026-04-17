import { IntersectionAnimation } from "../../utils/intersectionAnimation";

const introContentChildren = document.querySelector(".intro__content").children;
const popupList = document.querySelectorAll(".intro__popup");

function onHide() {
    Array.from(introContentChildren).forEach((ch) => {
        ch.classList.add("animation-popup--hide");
    });
    popupList.forEach((ch) => {
        ch.classList.add("animation-popup--grow-down");
    });
}
function onIntersect() {
    console.log("introContentChildren=", introContentChildren);
    Array.from(introContentChildren).forEach((ch, idx) => {
        ch.classList.remove("animation-popup--hide");
        ch.style.setProperty("--anim-popup-delay", `${0.2 * (idx + 1)}s`);
        ch.classList.add("animation-popup--show");
    });
    popupList.forEach((ch, idx) => {
        ch.classList.remove("animation-popup--grow-down");
        ch.style.setProperty("--anim-popup-delay", `${0.2 * (idx + 1)}s`);
        ch.classList.add("animation-popup--grow-up");
    });
}
export function initIntro() {
    // const intersectionObserver = new IntersectionAnimation({
    //     containerSelector: ".intro",
    //     onHide,
    //     onIntersect,
    //     threshold: 0.5,
    // });
}
