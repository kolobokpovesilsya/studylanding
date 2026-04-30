import { openModalById } from "../modal/modal";
import { RatingInput } from "../rating/rating";
import { Slider } from "../slider/slider";
let redrawOnce = true;
let testimonialRatingInput;
export function initTestimonial() {
    const slider = new Slider({
        selector: ".testimonial__slider",
        itemsGap: 5,
    });
    //Responsive slider observer
    const ro = new ResizeObserver((entries) => {
        for (let entry of entries) {
            // const width = entry.contentBoxSize
            //     ? entry.contentBoxSize.inlineSize
            //     : entry.contentRect.width;
            // console.log("resize===", document.body.offsetWidth);
            const width = document.body.offsetWidth;
            if (width <= 595) {
                slider.redraw();
                redrawOnce = true;
            } else if (width > 595 && redrawOnce) {
                console.log("once====");
                slider.redraw();
                redrawOnce = false;
            }
            // if(width<)
            // if(entry.target.tagName === 'H1'){
            //     entry.target.textContent = width < 1000 'small' : 'big'
            // }

            // if(entry.target.tagName === 'H2' && width < 500){
            //     entry.target.textContent = `I won't change anymore`
            //     ro.unobserve(entry.target) // прекращаем наблюдение, когда ширина элемента достигла 500px
            // }
        }
    });
    ro.observe(document.body);
    //Modal rating input
    testimonialRatingInput = new RatingInput(".testimonial__reviwer-stars");
}

export function closeAssessmentModalHandler(id, status) {
    const assesmentModal = document.querySelector(`#${id}`);
    console.log("close handle==", id, assesmentModal, status);
    if (!assesmentModal) {
        return;
    }
    switch (status) {
        case "ok":
            const data = getAssessmentModalInputs(assesmentModal);
            sendAssessment(data);
            openModalById("send-assessment-modal", {
                closeTimeout: 1500,
            });
            resetAssessmentModalInputs(assesmentModal);
            return;
        case "close":
            resetAssessmentModalInputs(assesmentModal);
            return;
    }
}
function getAssessmentModalInputs(modal) {
    const input = modal.querySelector("input");
    const textarea = modal.querySelector("textarea");
    let ratingValue = testimonialRatingInput?.getRating() || 0;

    const data = {
        name: input.value,
        text: textarea.value,
        rating: ratingValue,
    };

    return data;
}
function resetAssessmentModalInputs(modal) {
    const input = modal.querySelector("input");
    const textarea = modal.querySelector("textarea");
    input.value = "";
    textarea.value = "";
    testimonialRatingInput.setRating(0);
}
function validateAssessment() {}
function sendAssessment(data) {}
