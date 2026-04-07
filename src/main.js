import { initHeader } from "./blocks/header/header.js";
import { initClassroom } from "./blocks/classroom/classroom.js";

import { Slider } from "./blocks/slider/slider";

document.addEventListener("DOMContentLoaded", () => {
    initHeader();
    initClassroom();
    const slider = new Slider({
        selector: ".team__slider.slider",
    });
});
