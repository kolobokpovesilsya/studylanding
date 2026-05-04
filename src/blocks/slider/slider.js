import { toRem } from "../../utils/utils";

export class Slider {
    currentItem = 0;
    slidesCount = 0;
    sliderContainer;
    config;
    constructor(config) {
        this.config = config;
        this.initializeSlier(config);
    }
    initializeSlier = (config) => {
        const { selector, slidesPerView = 1, initialSlider = 0 } = config;
        const sliderContainer = document.querySelector(selector);
        if (!sliderContainer) {
            console.warn("There is no element by selector");
            return;
        }
        this.sliderContainer = sliderContainer;
        this.setupContainerConfiguration();
        if (!sliderContainer.classList.contains("slider")) {
            console.warn("There is no element with slider class");
            return;
        }

        const sliderList = sliderContainer.querySelector(".slider__list");
        const sliderItems = sliderContainer.querySelectorAll(".slider__item");

        if (!sliderItems.length) {
            console.log("Fail to find any slide item with slider__item class");
            return;
        }
        this.currentItem = this.getSlideNumber(
            initialSlider,
            sliderItems.length,
        );
        const bulletsList = this.getBulletList();
        const { width, height } = this.sliderContainer.getBoundingClientRect();
        let itemHeight = height;
        if (bulletsList) {
            itemHeight -= bulletsList.getBoundingClientRect().height;
        }

        sliderList.style.height = `${toRem(itemHeight)}rem`;
        for (let item of sliderItems) {
            item.style.height = `${toRem(itemHeight)}rem`;
            item.style.width = `${toRem(width / slidesPerView)}rem`;
        }
        this.initializeBullets();
        this.setActiveBullet(this.currentItem);
        this.initializeControls();
        this.onSliderMount(this.currentItem, sliderItems[this.currentItem]);
    };
    getSlideNumber = (num, count) => {
        let itemNumber = num;
        if (itemNumber < 0) {
            itemNumber = 0;
        } else if (itemNumber >= count) {
            itemNumber = count - 1;
        }
        return itemNumber;
    };
    setupContainerConfiguration = () => {
        const { itemsGap } = this.config;
        if (typeof itemsGap !== "undefined") {
            this.sliderContainer.style.setProperty(
                "--slide-items-gap",
                `${itemsGap}px`,
            );
        }
    };
    initializeControls = () => {
        const arrowLeft =
            this.sliderContainer.querySelector(".sider__arrow-left");
        const arrowRight = this.sliderContainer.querySelector(
            ".sider__arrow-right",
        );
        console.log("arrows--", arrowRight, arrowLeft);
        if (arrowLeft) {
            arrowLeft.onclick = () => this.slide(this.currentItem - 1);
        }
        if (arrowRight) {
            arrowRight.onclick = () => this.slide(this.currentItem + 1);
        }
    };
    getBulletList = () => {
        const bulletsList = this.sliderContainer.querySelector(
            ".slider__bullet-list",
        );
        if (!bulletsList) {
            return;
        }
        return bulletsList;
    };
    setActiveBullet = (activeIdx) => {
        const bulletsList = this.sliderContainer.querySelector(
            ".slider__bullet-list",
        );
        if (!bulletsList) {
            return;
        }

        Array.from(bulletsList.children).forEach((b, idx) => {
            console.log("====", b, b.classList);
            const cl = b.classList;
            if (cl.contains("slider__bullet--active") && idx !== activeIdx) {
                cl.remove("slider__bullet--active");
            } else if (
                !cl.contains("slider__bullet--active") &&
                idx == activeIdx
            ) {
                cl.add("slider__bullet--active");
            }
        });
    };
    initializeBullets = () => {
        const bulletsList = this.getBulletList();
        if (!bulletsList) {
            return;
        }
        for (let i = 0; i < bulletsList.children.length; i++) {
            const bullet = bulletsList.children[i];
            bullet.onclick = (e) => this.slide(i);
        }
    };
    getSlideByIdx = (idx) => {
        const sliderItems =
            this.sliderContainer.querySelectorAll(".slider__item");
        return sliderItems?.[idx];
    };
    onSliderMount(idx, item) {
        this.config.onSliderMount?.({
            idx,
            item,
        });
    }
    onBeforeSlide(idx, item) {
        this.config.onBeforeSlide?.({
            idx,
            item,
        });
    }
    onAfterSlide(idx, item) {
        this.config.onAfterSlide?.({
            idx,
            item,
        });
    }
    slide = (toIdx) => {
        if (toIdx < 0) {
            toIdx = this.slidesCount - 1;
        } else if (toIdx == this.slidesCount) {
            toIdx = 0;
        }
        const sliderItem = this.getSlideByIdx(toIdx);
        this.onBeforeSlide(toIdx, sliderItem);
        sliderItem?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "nearest",
        });

        this.currentItem = toIdx;
        this.setActiveBullet(toIdx);
        this.onAfterSlide(toIdx, sliderItem);
    };
    redraw() {
        this.initializeSlier(this.config);
    }
}

/*

<div class="team__slider slider">
                    <div class="slider__content">
                        <div class="slider__item">
                            <div class="team__sliter-content slider__content">
                                <h2>
                                    Slide 1
                                </h2>
                                <p>
                                    Slider item one
                                </p>
                            </div>

                        </div>
                        <div class="slider__item">
                            <div class="slider__content">
                                <h2>
                                    Slide 2
                                </h2>
                                <p>
                                    Slider item one
                                </p>
                            </div>

                        </div>
                        <div class="slider__item">
                            <div class="slider__content">
                                <h2>
                                    Slide 3
                                </h2>
                                <p>
                                    Slider item one
                                </p>
                            </div>

                        </div>
                    </div>

                    <div class="slider__bullet-list">
                        <div class="slider__bullet"></div>
                        <div class="slider__bullet"></div>
                        <div class="slider__bullet"></div>
                    </div>
                </div>
*/
