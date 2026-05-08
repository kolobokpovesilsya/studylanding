export const toRem = (px) =>
    +(px / parseFloat(getComputedStyle(document.documentElement).fontSize));

export function validateEmail(value) {
    if (!value?.trim()) {
        return false;
    }
    const isEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        value,
    );
    return isEmail;
}

export function debounce(func, ms = 100) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, ms);
    };
}
