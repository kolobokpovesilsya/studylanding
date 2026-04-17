// import "./blocks/header/header.scss";

import { initHeader } from "./blocks/header/header.js";
import { initClassroom } from "./blocks/classroom/classroom.js";
import { initBrands } from "./blocks/brands/brands.js";

import { Slider } from "./blocks/slider/slider";

document.addEventListener("DOMContentLoaded", () => {
    initHeader();
    initClassroom();
    initBrands();
    // const slider = new Slider({
    //     selector: ".team__slider.slider",
    // });
});
