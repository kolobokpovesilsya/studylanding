let prevScrollTop = 0;
const burgerBtn = document.querySelector(".header__burgerbutton");
const header = document.body.querySelector("header");
const scrollHandler = (e) => {
    const scrollTop = window.scrollY;
    if (!scrollTop) {
        header.classList.remove("header--fill");
        header.classList.remove("header--hide");
    } else if (scrollTop > prevScrollTop) {
        header.classList.add("header--hide");
    } else {
        header.classList.remove("header--hide");
        header.classList.add("header--fill");
    }
    prevScrollTop = scrollTop;
};
function clickBurgerMenu(e) {
    header.classList.toggle("header--extended");
}
export function initHeader() {
    document.addEventListener("scroll", scrollHandler);
    burgerBtn?.addEventListener("click", clickBurgerMenu);
}
