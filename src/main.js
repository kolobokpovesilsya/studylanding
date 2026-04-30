// import "./blocks/header/header.scss";

import { initHeader } from "./blocks/header/header.js";
import { initIntro } from "./blocks/intro/intro.js";
import { initClassroom } from "./blocks/classroom/classroom.js";
import { initBrands } from "./blocks/brands/brands.js";
import { initSoftware } from "./blocks/software/software.js";
import { LazyContentLoader } from "./lib/lazyimages/llazyimages.js";
import { IntersectionAnimation } from "./lib/animation/animation.js";
import {
    initTestimonial,
    closeAssessmentModalHandler,
} from "./blocks/testimonial/testimonial.js";
import { ModalController } from "./blocks/modal/modal.js";
const resetBtn = document.querySelector(".reset-scroll-btn");
function bubbleResetBtn(e) {
    const scrollTop = window.scrollY;
    const classList = resetBtn.classList;
    if (scrollTop > 500) {
        if (!classList.contains("reset-scroll-btn--show")) {
            classList.add("reset-scroll-btn--show");
        }
    } else {
        if (classList.contains("reset-scroll-btn--show")) {
            classList.remove("reset-scroll-btn--show");
        }
    }
}
function resetScroll() {
    window.scrollTo(0, 0);
}
function initBlocks() {
    initHeader();
    initIntro();
    initClassroom();
    initBrands();
    initSoftware();
    initTestimonial();
}
function closeModalHandler(modalId, status) {
    switch (modalId) {
        case "assessment-modal":
            return closeAssessmentModalHandler(modalId, status);
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const intersectionAnimation = new IntersectionAnimation({
        rootElement: document,
    });
    new LazyContentLoader({
        threshold: 0.01,
        rootMargin: "20px",
    });
    new ModalController(closeModalHandler);

    document.addEventListener("scroll", bubbleResetBtn);
    resetBtn.addEventListener("click", resetScroll);
    initBlocks();
});
