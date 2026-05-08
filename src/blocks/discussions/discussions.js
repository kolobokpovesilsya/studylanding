import { getAlertElement } from "../alert/alert";
import { openModalById } from "../modal/modal";

async function handleLoadMore() {
    try {
        const data = getData(modal);
        const result = await sendData(data);
        //TODO: Implement loading features
    } catch (e) {
        let alertElement;
        if (typeof e == "string") {
            alertElement = getAlertElement(e, "danger");
        } else {
            alertElement = getAlertElement("Fail to load features!", "danger");
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
export function initDiscussions() {
    const loadMoreBtn = document.querySelector(".discussions__more-btn");
    loadMoreBtn.onclick = handleLoadMore;
}
