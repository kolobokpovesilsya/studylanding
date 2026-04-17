export class IntersectionAnimation {
    constructor({
        containerSelector,
        getContainerSelector,
        onHide,
        onIntersect,
        once = true,
        threshold = 1,
    }) {
        const intersectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        console.log("Элемент появился в зоне видимости!");
                        // entry.target.style.opacity = "1";
                        onIntersect();
                        once && intersectionObserver.unobserve(entry.target);
                    } else {
                        console.log("элемента нет");
                        if (once) {
                            return;
                        }
                        onHide();
                        console.log("Элемент скрылся");
                    }
                });
            },
            { threshold },
        );
        const selector = getContainerSelector
            ? getContainerSelector()
            : containerSelector;
        const brandsSection = document.querySelector(selector);
        intersectionObserver.observe(brandsSection);

        if (onHide) {
            onHide();
        } else {
            selector.style.opacity = 0;
        }
    }
}
