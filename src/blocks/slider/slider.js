import { toRem } from "../../utils/utils";

export class Slider {
    currentItem = 0;
    slidesCount = 0;
    sliderContainer;
    config;
    rafId = null;
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
            console.warn("Fail to find any slide item with slider__item class");
            return;
        }
        this.slidesCount = sliderItems.length;
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
        requestAnimationFrame(() => {
            sliderList.style.height = `${toRem(itemHeight)}rem`;
            for (let item of sliderItems) {
                item.style.height = `${toRem(itemHeight)}rem`;
                item.style.width = `${toRem(width / slidesPerView)}rem`;
            }
        });
        this.initializeBullets();
        this.setActiveBullet(this.currentItem);
        this.initializeControls();
        this.onSliderMount(this.currentItem, sliderItems[this.currentItem]);
    };
    getSlideNumber = (num, count) => {
        let itemNumber = num;
        if (itemNumber < 0) {
            itemNumber = count - 1;
        } else if (itemNumber > count - 1) {
            itemNumber = 0;
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
        if (this.rafId) {
            return;
        }
        toIdx = this.getSlideNumber(toIdx, this.slidesCount);
        const targetSlide = this.getSlideByIdx(toIdx);
        if (!targetSlide) {
            return;
        }
        const prevSlide = this.getSlideByIdx(this.currentItem);
        if (!prevSlide) {
            return;
        }
        this.onBeforeSlide(toIdx, targetSlide);
        this.setActiveBullet(toIdx);

        const container = this.sliderContainer.querySelector(".slider__list");
        const start = prevSlide.offsetLeft;
        const end = targetSlide.offsetLeft;
        const distance = end - start;
        const duration = 200;
        let startTime = null;

        const ease = (t) => 1 - Math.pow(1 - t, 3);
        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            container.scrollLeft = start + distance * ease(progress);

            if (progress < 1) {
                this.rafId = requestAnimationFrame(animate);
            } else {
                this.currentItem = toIdx;
                this.rafId = null;
                this.onAfterSlide(toIdx, targetSlide);
            }
        };

        this.rafId = requestAnimationFrame(animate);
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
