export class IntersectionAnimation {
    constructor({ rootElement, onHide, onIntersect }) {
        const animationContainers = rootElement.querySelectorAll(
            "[data-animation-container]",
        );
        requestAnimationFrame(() => {
            window.scrollTo(0, scrollY);
            Array.from(animationContainers).forEach((e) =>
                this.connectIntersectionObserver(e, onIntersect, onHide),
            );
        });
    }
    connectIntersectionObserver(animationContainer, onIntersect, onHide) {
        let threshold = animationContainer.getAttribute("data-anim-threshold");
        if (animationContainer.offsetHeight > 700) {
            threshold = 0.2;
        }
        // const threshold = animationContainer.getAttribute('data-anim-threshold')
        const intersectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        this.toggleElementsAnimation(entry.target);
                        onIntersect?.(entry.target);
                        // once && intersectionObserver.unobserve(entry.target);
                    } else {
                        const once =
                            entry.target.getAttribute("data-anim-once");
                        if (once) {
                            return;
                        }
                        this.toggleElementsAnimation(entry.target, true);
                        onHide?.(entry.target);
                    }
                });
            },
            { threshold: threshold ? +threshold : 1 },
        );
        intersectionObserver.observe(animationContainer);
        this.toggleElementsAnimation(animationContainer, true);
        onHide?.(animationContainer);
    }
    toggleElementsAnimation = (animationContainer, reset = false) => {
        const animatedElementList =
            animationContainer.querySelectorAll("[data-animation]");

        Array.from(animatedElementList).forEach((el) => {
            const animationType = el.getAttribute("data-animation");
            if (animationType) {
                const origin = el.getAttribute("data-anim-origin");
                const delay = el.getAttribute("data-anim-delay");
                const duration = el.getAttribute("data-anim-duration");
                const shiftY = el.getAttribute("data-anim-y");
                const shiftX = el.getAttribute("data-anim-x");
                const animationClass = this.getAnimationClass(
                    animationType,
                    reset,
                );
                delay && el.style.setProperty("--anim-delay", `${delay}s`);
                shiftY && el.style.setProperty("--anim-y", `${shiftY}`);
                shiftX && el.style.setProperty("--anim-x", `${shiftX}`);
                origin && el.style.setProperty("--origin", origin);
                duration && el.style.setProperty("--duration", duration);
                el.classList.add(animationClass);
            }
        });
    };
    getAnimationClass = (animationType, reset) => {
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
    };
}
