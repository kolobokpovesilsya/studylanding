import { Slider } from "../slider/slider";
let redrawOnce = true;
export function initTestimonial() {
    const slider = new Slider({
        selector: ".testimonial__slider",
        itemsGap: 5,
    });
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
}
