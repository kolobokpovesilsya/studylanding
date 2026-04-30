const toRem = (px) =>
    +(px / parseFloat(getComputedStyle(document.documentElement).fontSize));

class Slider {
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

        const sliderItems = sliderContainer.querySelectorAll(".slider__item");

        if (!sliderItems.length) {
            console.log("Fail to find any slide item with slider__item class");
            return;
        }
        this.slidesCount = sliderItems.length;
        this.currentItem = initialSlider;

        const { width, height } = this.sliderContainer.getBoundingClientRect();
        console.log(
            "this.sliderContainer.style",
            this.sliderContainer.style.height,
            this.sliderContainer.style.width,
        );
        for (let item of sliderItems) {
            item.style.height = `${toRem(height)}rem`;
            item.style.width = `${toRem(width / slidesPerView)}rem`;
        }
        this.initializeBullets();
        this.initializeControls();
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
    slide = (toIdx) => {
        if (toIdx < 0) {
            toIdx = this.slidesCount - 1;
        } else if (toIdx == this.slidesCount) {
            toIdx = 0;
        }
        const sliderItem = this.getSlideByIdx(toIdx);
        sliderItem?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "nearest",
        });

        this.currentItem = toIdx;
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

export { Slider as S };
