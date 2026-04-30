import { i as initHeader } from './blocks/header/header.js';
import './blocks/intro/intro.js';
import { i as initClassroom } from './blocks/classroom/classroom.js';
import './blocks/brands/brands.js';
import './blocks/software/software.js';
import { i as initTestimonial } from './blocks/testimonial/testimonial.js';
import './blocks/menu/menu.js';
import './blocks/slider/slider.js';

class LazyContentLoader {
    observer;
    constructor({ threshold, rootMargin }) {
        const lazyLoadableContentList =
            document.querySelectorAll("[data-lazy]");

        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {

                        const content = entry.target;
                        setTimeout(() => {
                            if (!entry.isIntersecting) {
                                return;
                            }
                            if (content instanceof HTMLPictureElement) {
                                this.handlePictureIntersect(content);
                            } else if (content instanceof HTMLVideoElement) {

                                this.handleVideoIntersect(content);
                            }
                            this.observer.unobserve(content);
                        }, 200);
                    } else {
                        console.log("элемента нет");
                    }
                });
            },
            { threshold, rootMargin },
        );
        lazyLoadableContentList.forEach((cnt) => {
            this.observer.observe(cnt);
        });
    }
    handlePictureIntersect = (picture) => {
        const sources = picture.querySelectorAll("source");
        for (let src of sources) {
            const srcset = src.dataset.srcset;
            if (!srcset) {
                continue;
            }
            src.srcset = srcset;
            src.onerror = () => {
                console.warn("Fail to load ", srcset);
            };
            delete src.dataset.srcset;
        }
        const img = picture.querySelector("img");
        const srcset = img.dataset.src;

        img.src = srcset;
        img.onerror = () => {
            console.log("Fail to load src", src);
        };

        delete img.dataset.src;
    };
    handleVideoIntersect = (video) => { 
        const sources = video.querySelectorAll("source");
        for (let src of sources) {
            const srcset = src.dataset.src;
            if (!srcset) {
                continue;
            }
            src.src = srcset;
            src.onerror = () => {
                console.warn("Fail to load ", srcset);
            };


            delete src.dataset.src;
        }
        video.load();
         if (video.hasAttribute("autoplay")) { 
                video.muted = true;
                video
                    .play()
                    .catch((e) => console.log("Autoplay prevented"));
            }
        

    };
}

class IntersectionAnimation {
    constructor({
        rootElement  ,
        onHide,
        onIntersect,
    }) {
        const animationContainers = rootElement.querySelectorAll('[data-animation-container]');
        Array.from(animationContainers).forEach(e=>this.connectIntersectionObserver(e,onIntersect,onHide));
        
    }
    connectIntersectionObserver(animationContainer,onIntersect,onHide) {
        const threshold = animationContainer.getAttribute('data-anim-threshold');
        const intersectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        this.toggleElementsAnimation(entry.target);
                        onIntersect?.(entry.target);
                        // once && intersectionObserver.unobserve(entry.target);
                    } else {
                       
                        const once = entry.target.getAttribute('data-anim-once');
                        if (once) {
                            return;
                        }
                        this.toggleElementsAnimation(entry.target, true);
                        onHide?.(entry.target);
                    }
                });
            },
            { threshold:threshold?+threshold:1 },
        );
        intersectionObserver.observe(animationContainer);
        this.toggleElementsAnimation(animationContainer, true);
        onHide?.(animationContainer);
    }
    toggleElementsAnimation = (animationContainer, reset = false) => {
        const animatedElementList = animationContainer.querySelectorAll('[data-animation]');
        
        Array.from(animatedElementList).forEach(el => {
            const animationType = el.getAttribute('data-animation');
            const origin = el.getAttribute('data-anim-origin');
            const delay = el.getAttribute('data-anim-delay');
            const duration = el.getAttribute('data-anim-duration');
            const shiftY = el.getAttribute('data-anim-y');
            const shiftX = el.getAttribute('data-anim-x');
            const animationClass = this.getAnimationClass(animationType,reset);
            delay && el.style.setProperty("--anim-delay", `${delay}s`);
            shiftY && el.style.setProperty("--anim-y", `${shiftY}`);
            shiftX && el.style.setProperty("--anim-x", `${shiftX}`);
            origin && el.style.setProperty("--origin", origin);
            duration && el.style.setProperty("--duration", duration);
            el.classList.add(animationClass);
        });
    }
    getAnimationClass = (animationType, reset) => {
        switch (animationType) {
            case 'slide-y':                
                return `animation--slide-y-${reset?'reset':'enter'}`
            case 'slide-x':                
                return `animation--slide-x-${reset?'reset':'enter'}`
            case 'popup':
                return  `animation--popup-${reset?'reset':'enter'}`
            case 'flip-y':
                return `animation--flip-y-${reset?'reset':'enter'}`
            case 'flip-x':
                return `animation--flip-x-${reset?'reset':'enter'}`
            case 'fade':
                return `animation--fade-${reset?'reset':'enter'}`
            default:
                console.warn('Unknow animation type:',animationType);
                return  null
        }
    }
}

// import "./blocks/header/header.scss";

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
    initClassroom();
    initTestimonial();
}
document.addEventListener("DOMContentLoaded", () => {
    new IntersectionAnimation({
        rootElement: document,
    });
    new LazyContentLoader({
        threshold: 0.01,
        rootMargin: "20px",
    });
    document.addEventListener("scroll", bubbleResetBtn);
    resetBtn.addEventListener("click", resetScroll);
    initBlocks();
});
