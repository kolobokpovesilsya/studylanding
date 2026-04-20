// import "./blocks/header/header.scss";

import { initHeader } from "./blocks/header/header.js";
import { initIntro } from "./blocks/intro/intro.js";
import { initClassroom } from "./blocks/classroom/classroom.js";
import { initBrands } from "./blocks/brands/brands.js";
import { initSoftware } from "./blocks/software/software.js";
import {
    LazyContentLoader, 
} from "./lib/lazyimages/llazyimages.js";
import { IntersectionAnimation } from "./lib/animation/animation.js";

document.addEventListener("DOMContentLoaded", () => {
    const intersectionAnimation = new IntersectionAnimation({
        rootElement: document,
    });
    new  LazyContentLoader({
        threshold: 0.01,
        rootMargin: "20px",
    });
    initHeader();
    initIntro();
    initClassroom();
    initBrands();
    initSoftware();
    // const slider = new Slider({
    //     selector: ".team__slider.slider",
    // });
});
