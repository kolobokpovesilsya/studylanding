let prevScrollTop = 0;
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
    const ifHeaderHeightCompleted = shouldExpand ? currentHeaderHeight > window.innerHeight : currentHeaderHeight <= initialHeaderHeight;
    const finishHeaderHeight = shouldExpand ? window.innerHeight : initialHeaderHeight;
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
function initHeader() {
  document.addEventListener("scroll", scrollHandler);
  burgerBtn == null ? void 0 : burgerBtn.addEventListener("click", clickBurgerMenu);
}
export {
  initHeader as i
};
