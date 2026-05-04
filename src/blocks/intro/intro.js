import { LazyContentLoader } from "../../lib/lazyimages/llazyimages";
import { openModalById } from "../modal/modal";
import { Slider } from "../slider/slider";
// const joinBtn = document.querySelector(".intro__btn-join");
const playBtn = document.querySelector(".intro__btn-play");
function onBeforeSlide({ idx, item }) {
    requestAnimationFrame(() => {
        const contentList = item.querySelectorAll("[data-lazy='manual']");
        contentList.forEach((cnt) => {
            LazyContentLoader.loadLazyContent(cnt);
        });
    });
}
const slider = new Slider({
    selector: ".intro__slider",
    itemsGap: 5,
    onBeforeSlide,
    onSliderMount: onBeforeSlide,
});

playBtn.onclick = () => {
    openModalById("how-it-works-modal", { openCallback: updateSlider });
};
// joinBtn.onclick = () => {
//     openModalById("sign-up-modal");
// };
function updateSlider() {
    requestAnimationFrame(() => {
        slider.redraw();
    });
}
export function initIntro() {}
