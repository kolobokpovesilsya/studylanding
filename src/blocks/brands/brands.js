import { IntersectionAnimation } from "../../utils/intersectionAnimation";

const brandsSection = document.querySelector(".brands__container");
const brandsTitle = document.querySelector(".brands__title");
const brandsItems = document.querySelectorAll(".brands__item");

function onHide() {
    brandsTitle.classList.add("brands__title--hide");
    brandsItems.forEach((item) => {
        item.classList.add("brands__item--hide");
    });
}
function onIntersect() {
    brandsTitle.classList.remove("brands__title--hide");
    brandsTitle.classList.add("brands__title--show");
    brandsItems.forEach((item, idx) => {
        item.classList.remove("brands__item--hide");
        item.style.setProperty("--delay", `${0.2 * (idx + 1)}s`);
        item.classList.add("brands__item--show");
    });
}
export function initBrands() {
    const intersectionObserver = new IntersectionAnimation({
        containerSelector: ".brands",
        onHide,
        onIntersect,
    });
}
