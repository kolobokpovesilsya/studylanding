export const toRem = (px) =>
    +(px / parseFloat(getComputedStyle(document.documentElement).fontSize));
