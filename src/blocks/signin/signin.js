import { getAlertElement } from "../alert/alert";
import { openModalById } from "../modal/modal";

export async function closeSigninModalHandler(modal, status) {
    switch (status) {
        case "ok":
            let alertElement;
            try {
                const data = getData(modal);
                await sendData(data);
                alertElement = getAlertElement(
                    "User logged in successfully!",
                    "success",
                );
                openModalById("blank-modal", {
                    closeTimeout: 1500,
                    message: alertElement,
                });
            } catch (e) {
                if (typeof e == "string") {
                    alertElement = getAlertElement(e, "danger");
                } else {
                    alertElement = getAlertElement("Fail to login!", "danger");
                }
                openModalById("blank-modal", {
                    closeTimeout: 1500,
                    message: alertElement,
                });
            }
            break;
        case "close":
            return;
    }
}
function getData(modal) {
    const form = modal.querySelector("form");
    const email = form.elements["email"].value.trim();
    const password = form.elements["password"].value.trim();

    return {
        email,
        password,
    };
}

function sendData(data) {
    return Promise.reject("Service unuvailable now!");
}
