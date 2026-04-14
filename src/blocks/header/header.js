let prevScrollTop=0

const scrollHandler=(e)=>{
    const header = document.body.querySelector('header')
    const scrollTop = window.scrollY
    if(!scrollTop){
        header.classList.remove('header--fill')
        header.classList.remove('header--hide')
    }else if(scrollTop>prevScrollTop){
        header.classList.add('header--hide')
    }else{
        header.classList.remove('header--hide')
        header.classList.add('header--fill')
    }
    prevScrollTop =scrollTop
}
export function initHeader() {
    document.addEventListener('scroll',scrollHandler)
}
