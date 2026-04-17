export class IntersectionAnimation {
    constructor({
        rootElement  ,
        onHide,
        onIntersect,
    }) {
        const animationContainers = rootElement.querySelectorAll('[data-animation-container]')
        Array.from(animationContainers).forEach(e=>this.connectIntersectionObserver(e,onIntersect,onHide))
        
    }
    connectIntersectionObserver(animationContainer,onIntersect,onHide) {
        const threshold = animationContainer.getAttribute('data-anim-threshold')
        const intersectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        this.toggleElementsAnimation(entry.target)
                        onIntersect?.(entry.target);
                        // once && intersectionObserver.unobserve(entry.target);
                    } else {
                       
                        const once = entry.target.getAttribute('data-anim-once')
                        if (once) {
                            return;
                        }
                        this.toggleElementsAnimation(entry.target, true)
                        onHide?.(entry.target);
                    }
                });
            },
            { threshold:threshold?+threshold:1 },
        );
        intersectionObserver.observe(animationContainer);
        this.toggleElementsAnimation(animationContainer, true)
        onHide?.(animationContainer);
    }
    toggleElementsAnimation = (animationContainer, reset = false) => {
        const animatedElementList = animationContainer.querySelectorAll('[data-animation]')
        
        Array.from(animatedElementList).forEach(el => {
            const animationType = el.getAttribute('data-animation')
            const delay = el.getAttribute('data-anim-delay')
            const shiftY = el.getAttribute('data-anim-y')
             console.log('animation class---',animationType)
            const animationClass = this.getAnimationClass(animationType,reset)
            delay && el.style.setProperty("--anim-delay", `${delay}s`);
            shiftY && el.style.setProperty("--anim-y", `${shiftY}s`);
            el.classList.add(animationClass)
        })
    }
    getAnimationClass = (animationType, reset) => {
        switch (animationType) {
            case 'slide-y':                
                return `animation--slide-y-${reset?'reset':'enter'}`
            case 'popup':
                return  `animation--popup-${reset?'reset':'enter'}`
            case 'flip-y':
                return `animation--flip-y-${reset?'reset':'enter'}`
            default:
                console.warn('Unknow animation type:',animationType)
                return  null
        }
    }
}
