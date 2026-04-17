import { IntersectionAnimation } from "../../utils/intersectionAnimation";

const textContentList = [
    document.querySelector(".software__title"),
    document.querySelector(".software__description"),
];
const cardList = document.querySelectorAll(".software__card-item");

function onHide() {
    textContentList.forEach((ch) => {
        ch.classList.add("animation-popup--hide");
    });
    cardList.forEach((ch) => {
        ch.classList.add("animation-popup--flip-y-hide");
    });
}
function onIntersect() {
    textContentList.forEach((ch, idx) => {
        ch.classList.remove("animation-popup--hide");
        ch.style.setProperty("--anim-popup-delay", `${0.2 * (idx + 1)}s`);
        ch.classList.add("animation-popup--show");
    });
    cardList.forEach((ch, idx) => {
        ch.classList.remove("animation-popup--flip-y-hide");
        ch.style.setProperty("--anim-popup-delay", `${0.2 * (idx + 1)}s`);
        ch.classList.add("animation-popup--flip-y-show");
    });
}
export function initSoftware() {
    // const intersectionObserver = new IntersectionAnimation({
    //     containerSelector: ".software__container",
    //     onHide,
    //     onIntersect,
    //     threshold: 0.5,
    // });
}
