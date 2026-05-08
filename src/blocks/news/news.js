import { getAlertElement } from "../alert/alert";
import { openModalById } from "../modal/modal";

async function handleLoadNewsItem(e) {
    e.preventDefault();
    try {
        const data = getData(modal);
        const result = await sendData(data);
        //TODO: Implement loading features
    } catch (e) {
        let alertElement;
        if (typeof e == "string") {
            alertElement = getAlertElement(e, "danger");
        } else {
            alertElement = getAlertElement("Fail to load news itom!", "danger");
        }
        openModalById("blank-modal", {
            closeTimeout: 1500,
            message: alertElement,
        });
    }
}
function getData() {
    return Promise.reject("Service unuvailable now!");
}
export function initNews() {
    const loadMoreBtn = document.querySelector(".news__main-link");
    loadMoreBtn.onclick = handleLoadNewsItem;
}
