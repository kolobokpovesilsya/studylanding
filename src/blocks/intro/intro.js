import { LazyContentLoader } from "../../lib/lazyimages/llazyimages";
import { openModalById } from "../modal/modal";
import { Slider } from "../slider/slider";
const playBtn = document.querySelector(".intro__btn-play");
function onBeforeSlide({ idx, item }) {
    requestAnimationFrame(() => {
        const contentList = item.querySelectorAll("[data-lazy='manual']");
        console.log("contentList===", contentList);
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
function updateSlider() {
    requestAnimationFrame(() => {
        slider.redraw();
    });
}
export function initIntro() {}
