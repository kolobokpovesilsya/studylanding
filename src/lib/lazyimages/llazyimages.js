export class LazyContentLoader {
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
