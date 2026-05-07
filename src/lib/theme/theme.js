const THEME_FIELD = "studylanding-theme";
export const LIGHT_THEME = "light";
export const DARK_THEME = "dark";

export function getTheme() {
    const userTheme = localStorage.getItem(THEME_FIELD);
    if (userTheme) {
        return userTheme;
    }
    if (window.matchMedia(`(prefers-color-scheme: ${DARK_THEME})`).matches) {
        return DARK_THEME;
    } else if (
        window.matchMedia(`(prefers-color-scheme: ${LIGHT_THEME})`).matches
    ) {
        return LIGHT_THEME;
    } else {
        return LIGHT_THEME;
    }
}
export function setTheme(theme) {
    localStorage.setItem(THEME_FIELD, theme);
}
