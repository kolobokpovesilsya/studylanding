

export class Slider {
    currentItem = 0
    sliderContainer
    config
    constructor(config) {
        this.config = config
        const {
            selector,
            slidesPerView = 1,
            initialSlider = 0
        } = config
        const sliderContainer = document.querySelector(selector)
        if (!sliderContainer) {
            console.warn('There is no element by selector')
            return
        }
        this.sliderContainer = sliderContainer
        if (!sliderContainer.classList.contains('slider')) {
            console.warn('There is no element with slider class')
            return
        }
  
        const sliderItems = sliderContainer.querySelectorAll('.slider__item')
       console.log('slider containersliderContainer==',sliderContainer,sliderItems)
        if (!sliderItems.length) {
            console.log('Fail to find any slide item with slider__item class')
            return
        }
        this.currentItem = initialSlider

        const { width, height } = this.sliderContainer.getBoundingClientRect()
        console.log('sliderItems---',sliderItems)
        for (let item of sliderItems) { 
            item.style.height = `${height}px`
            item.style.width = `${width / slidesPerView}px`
        }
        this.initializeBullets()
    }
    getBulletList = () => {
        const bulletsList = this.sliderContainer.querySelector('.slider__bullet-list')
        if (!bulletsList) {
            return
        }
        return bulletsList
    }
    initializeBullets = () => {
        const bulletsList = this.getBulletList()
        if (!bulletsList) {
            return
        }
        console.log('bullets===', bulletsList.children)
        for (let i = 0; i < bulletsList.children.length; i++) {
            const bullet = bulletsList.children[i]
            bullet.onclick = (e) => this.slide(i)
        }
        // bulletsList.children.forEach((b,idx)=>{
        //     console.log('add event handler')
        //     b.onclick=(e)=>this.slide(idx)
        // })
    }
    slide = (toIdx) => {
        // const bulletsList = this.getBulletList()
        // if (!bulletsList) {
        //     return
        // }
        // console.log('slide to===', toIdx)
        // const toSliderItem = bulletsList.children[toIdx]
        
        //  container.scrollTo({ left: 500, behavior: 'smooth' });
        
        const sliderItems = this.sliderContainer.querySelectorAll('.slider__item')
        if(!sliderItems?.length){
            return 
        }
        console.log('to page===',this.sliderContainer,sliderItems)
        const toSliderItem = sliderItems[toIdx]
        toSliderItem.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'start'
        });
        this.currentItem = toIdx
    }
    getSliderWith = () => {
        const { width } = this.sliderContainer.getBoundingClientRect()
        const { slidesPerView } = this.config
        return width / (slidesPerView || 1)
    }
}

/*

<div class="team__slider slider">
                    <div class="slider__content">
                        <div class="slider__item">
                            <div class="team__sliter-content slider__content">
                                <h2>
                                    Slide 1
                                </h2>
                                <p>
                                    Slider item one
                                </p>
                            </div>

                        </div>
                        <div class="slider__item">
                            <div class="slider__content">
                                <h2>
                                    Slide 2
                                </h2>
                                <p>
                                    Slider item one
                                </p>
                            </div>

                        </div>
                        <div class="slider__item">
                            <div class="slider__content">
                                <h2>
                                    Slide 3
                                </h2>
                                <p>
                                    Slider item one
                                </p>
                            </div>

                        </div>
                    </div>

                    <div class="slider__bullet-list">
                        <div class="slider__bullet"></div>
                        <div class="slider__bullet"></div>
                        <div class="slider__bullet"></div>
                    </div>
                </div>
*/