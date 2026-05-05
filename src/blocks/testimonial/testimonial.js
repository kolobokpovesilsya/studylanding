import { openModalById } from "../modal/modal";
import { RatingInput } from "../rating/rating";
import { Slider } from "../slider/slider";
let redrawOnce = true;
export function initTestimonial() {
    const slider = new Slider({
        selector: ".testimonial__slider",
        itemsGap: 5,
    });
    const ro = new ResizeObserver((entries) => {
        for (let entry of entries) {
            const width = document.body.offsetWidth;
            if (width <= 595) {
                slider.redraw();
                redrawOnce = true;
            } else if (width > 595 && redrawOnce) {
                slider.redraw();
                redrawOnce = false;
            }
        }
    });
    ro.observe(document.body);
}

export function closeAssessmentModalHandler(modal, status) {
    switch (status) {
        case "ok":
            const data = getAssessmentModalInputs(modal);
            sendAssessment(data);
            openModalById("send-assessment-modal", {
                closeTimeout: 1500,
            });
            return;
        case "close":
            return;
    }
}
function getAssessmentModalInputs(modal) {
    const input = modal.querySelector("input");
    const textarea = modal.querySelector("textarea");
    let ratingValue = modal.querySelector("rating-input");

    const data = {
        name: input.value,
        text: textarea.value,
        rating: ratingValue.value,
    };
    return data;
}

function sendAssessment(data) {}
