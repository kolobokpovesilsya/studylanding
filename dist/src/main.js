var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { i as initHeader } from "./blocks/header/header.js";
import "./blocks/intro/intro.js";
import { i as initClassroom } from "./blocks/classroom/classroom.js";
import "./blocks/brands/brands.js";
import "./blocks/software/software.js";
class IntersectionAnimation {
  constructor({
    rootElement,
    onHide,
    onIntersect
  }) {
    __publicField(this, "toggleElementsAnimation", (animationContainer, reset = false) => {
      const animatedElementList = animationContainer.querySelectorAll("[data-animation]");
      Array.from(animatedElementList).forEach((el) => {
        const animationType = el.getAttribute("data-animation");
        const origin = el.getAttribute("data-anim-origin");
        const delay = el.getAttribute("data-anim-delay");
        const duration = el.getAttribute("data-anim-duration");
        const shiftY = el.getAttribute("data-anim-y");
        const shiftX = el.getAttribute("data-anim-x");
        const animationClass = this.getAnimationClass(animationType, reset);
        delay && el.style.setProperty("--anim-delay", `${delay}s`);
        shiftY && el.style.setProperty("--anim-y", `${shiftY}`);
        shiftX && el.style.setProperty("--anim-x", `${shiftX}`);
        origin && el.style.setProperty("--origin", origin);
        duration && el.style.setProperty("--duration", duration);
        el.classList.add(animationClass);
      });
    });
    __publicField(this, "getAnimationClass", (animationType, reset) => {
      switch (animationType) {
        case "slide-y":
          return `animation--slide-y-${reset ? "reset" : "enter"}`;
        case "slide-x":
          return `animation--slide-x-${reset ? "reset" : "enter"}`;
        case "popup":
          return `animation--popup-${reset ? "reset" : "enter"}`;
        case "flip-y":
          return `animation--flip-y-${reset ? "reset" : "enter"}`;
        case "flip-x":
          return `animation--flip-x-${reset ? "reset" : "enter"}`;
        case "fade":
          return `animation--fade-${reset ? "reset" : "enter"}`;
        default:
          console.warn("Unknow animation type:", animationType);
          return null;
      }
    });
    const animationContainers = rootElement.querySelectorAll("[data-animation-container]");
    Array.from(animationContainers).forEach((e) => this.connectIntersectionObserver(e, onIntersect, onHide));
  }
  connectIntersectionObserver(animationContainer, onIntersect, onHide) {
    const threshold = animationContainer.getAttribute("data-anim-threshold");
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.toggleElementsAnimation(entry.target);
            onIntersect == null ? void 0 : onIntersect(entry.target);
          } else {
            const once = entry.target.getAttribute("data-anim-once");
            if (once) {
              return;
            }
            this.toggleElementsAnimation(entry.target, true);
            onHide == null ? void 0 : onHide(entry.target);
          }
        });
      },
      { threshold: threshold ? +threshold : 1 }
    );
    intersectionObserver.observe(animationContainer);
    this.toggleElementsAnimation(animationContainer, true);
    onHide == null ? void 0 : onHide(animationContainer);
  }
}
class LazyImageLoader {
  constructor({ threshold, rootMargin }) {
    __publicField(this, "observer");
    __publicField(this, "handleIntersect", (picture) => {
      const sources = picture.querySelectorAll("source");
      for (let src2 of sources) {
        const srcset2 = src2.dataset.srcset;
        if (!srcset2) {
          continue;
        }
        src2.srcset = srcset2;
        src2.onerror = () => {
          console.warn("Fail to load ", srcset2);
        };
        delete src2.dataset.srcset;
      }
      const img = picture.querySelector("img");
      const srcset = img.dataset.src;
      img.src = srcset;
      img.onerror = () => {
        console.log("Fail to load src", src);
      };
      delete img.dataset.src;
    });
    const lazyLoadableImages = document.querySelectorAll("[data-lazy]");
    if (!lazyLoadableImages.length) {
      return;
    }
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log("Ленивая загрузка");
            const picture = entry.target;
            setTimeout(() => {
              if (!entry.isIntersecting) {
                return;
              }
              this.handleIntersect(picture);
              this.observer.unobserve(picture);
            }, 200);
          } else {
            console.log("элемента нет");
          }
        });
      },
      { threshold, rootMargin }
    );
    lazyLoadableImages.forEach((img) => {
      this.observer.observe(img);
    });
  }
}
document.addEventListener("DOMContentLoaded", () => {
  new IntersectionAnimation({
    rootElement: document
  });
  new LazyImageLoader({
    threshold: 0.01,
    rootMargin: "20px"
  });
  initHeader();
  initClassroom();
});
