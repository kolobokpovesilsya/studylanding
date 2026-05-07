import {
    DARK_THEME,
    getTheme,
    LIGHT_THEME,
    setTheme,
} from "../../lib/theme/theme";
import { MenuController } from "../menu/menu";
const THEME_CLASS = "theme-dark";
let prevScrollTop = 0;
// const signupBtn = document.querySelector(".header__sign-up");
const themeBtn = document.querySelector(".header__theme-btn input");
const burgerBtn = document.querySelector(".header__burgerbutton");
const header = document.body.querySelector("header");
let initialHeaderHeight;
let initialHeaderBackground;
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

function toggleExpand(endCallback, duration = 200) {
    const startHeaderHeight = header.offsetHeight;
    let startTime = performance.now();
    const shouldExpand = window.innerHeight > startHeaderHeight;
    let delta = window.innerHeight / 4;
    if (!shouldExpand) {
        delta *= -1;
    }
    function doExpand(currentTime) {
        const elapsed = currentTime - startTime;
        const factor = currentTime / startTime;
        let currentHeaderHeight = header.offsetHeight + delta * factor;
        let timeIsOver = elapsed > duration;
        const ifHeaderHeightCompleted = shouldExpand
            ? currentHeaderHeight > window.innerHeight
            : currentHeaderHeight <= initialHeaderHeight;
        const finishHeaderHeight = shouldExpand
            ? window.innerHeight
            : initialHeaderHeight;
        if (ifHeaderHeightCompleted || timeIsOver) {
            header.style.height = `${finishHeaderHeight}px`;
            endCallback();
        } else {
            header.style.height = `${currentHeaderHeight}px`;
            requestAnimationFrame(doExpand);
        }
    }
    requestAnimationFrame(doExpand);
}
function clickBurgerMenu(e) {
    if (!header.classList.contains("header--extended")) {
        initialHeaderHeight = header.offsetHeight;
        initialHeaderBackground = header.style.background;
        header.style.background = "var(--color-panel)";
        toggleExpand(() => {
            header.classList.toggle("header--extended");
            header.style.height = "100%";
        });
    } else {
        toggleExpand(() => {
            header.classList.toggle("header--extended");
            setTimeout(() => {
                header.style.background = initialHeaderBackground;
                header.style.height = "min-content";
            }, 200);
        });
    }
}
function initializeTheme() {
    const theme = getTheme();
    document.body.classList.remove(THEME_CLASS);
    if (theme == DARK_THEME) {
        document.body.classList.add(THEME_CLASS);
        themeBtn.checked = false;
    } else {
        themeBtn.checked = true;
    }
}
function toggleTheme() {
    const currentTheme = document.body.classList.contains(THEME_CLASS)
        ? LIGHT_THEME
        : DARK_THEME;
    setTheme(currentTheme);
    document.body.classList.remove(THEME_CLASS);
    if (currentTheme == DARK_THEME) {
        document.body.classList.add(THEME_CLASS);
    }
}
export function initHeader() {
    document.addEventListener("scroll", scrollHandler);
    burgerBtn?.addEventListener("click", clickBurgerMenu);
    themeBtn.onclick = toggleTheme;
    initializeTheme();
    const menuElement = document.querySelector(".header .menu");
    const menuController = new MenuController(menuElement);
}
