export class LazyImageLoader {
    observer;
    constructor({ threshold, rootMargin }) {
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
            { threshold, rootMargin },
        );
        lazyLoadableImages.forEach((img) => {
            this.observer.observe(img);
        });
    }
    handleIntersect = (picture) => {
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
}
