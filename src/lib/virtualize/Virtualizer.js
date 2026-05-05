export class Virtualizer {
    container;
    sizeObserver;
    topSpacer;
    bottomSpacer;
    children = {};
    constructor(containerElement) {
        this.container = containerElement;
        containerElement.addEventListener("scroll", (e) => {
            console.log("scroll==", this.bottomSpacer.offsetTop);
            const children = Array.from(this.container.children || []);
            for (let child of children) {
                const chY = child.offsetTop;
                const chHeight = child.offsetHeight;
                // console.log("child", child, chY, chHeight);
            }
            // this.render();
        });
        this.init();
    }

    init() {
        const spacer = document.createElement("div");
        spacer.className = "spacer";
        spacer.style.gridColumn = "1 / -1";
        spacer.style.minHeight = "1px";
        spacer.style.margin = "0px";
        spacer.style.padding = "0px";
        this.topSpacer = spacer;
        this.bottomSpacer = spacer.cloneNode();
        this.container.appendChild(this.bottomSpacer);
        this.container.prepend(this.topSpacer);
        requestAnimationFrame(() => {
            this.render();
        });
    }
    render() {
        const { scrollTop, clientHeight, scrollHeight } = this.container;
        const children = Array.from(this.container.children || []);

        const bottomBorder = scrollTop + clientHeight;
        const paddingTop = scrollTop;
        const paddingBottom = scrollHeight - bottomBorder;

        let topDelta = 0;
        let bottomDelta = 0;

        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const chY = child.offsetTop;
            const chHeight = child.offsetHeight;
            // const { y, height } = child.getBoundingClientRect();
            if (child.classList.contains("spacer")) {
                continue;
            }
            this.children[i] = {
                y: chY,
                height: chHeight,
            };
            if (chY + chHeight < scrollTop) {
                // console.log("before ===", child, y);
                child.style.display = "none";
            } else if (chY > bottomBorder) {
                // console.log("after==", child, y);
                child.style.display = "none";
            } else {
                // console.log("visible", child);
                child.style.display = "block";
                if (chY < scrollTop && chY + chHeight > scrollTop) {
                    topDelta = Math.max(topDelta, scrollTop - chY);
                } else if (
                    chY + chHeight > bottomBorder &&
                    chY < bottomBorder
                ) {
                    bottomDelta = Math.max(
                        bottomDelta,
                        chY + chHeight - bottomBorder,
                    );
                }
            }
        }
        this.topSpacer.style.paddingTop = `${paddingTop - topDelta}px`;
        this.bottomSpacer.style.paddingBottom = `${paddingBottom - bottomDelta}px`;
        requestAnimationFrame(() => {
            console.log(
                "final padding",
                this.container.scrollHeight,
                paddingTop - topDelta,
                paddingBottom - bottomDelta,
            );
        });

        //     });

        // });
    }
}
