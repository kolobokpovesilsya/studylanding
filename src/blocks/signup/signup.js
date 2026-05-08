import { getAlertElement } from "../alert/alert";
import { openModalById } from "../modal/modal";

export async function closeSignupModalHandler(modal, status) {
    switch (status) {
        case "ok":
            let alertElement;
            try {
                const data = getData(modal);
                await sendData(data);
                alertElement = getAlertElement(
                    "User signed up successfully!",
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
                    alertElement = getAlertElement(
                        "Fail to sign up!",
                        "danger",
                    );
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
    console.log("form===", form, form.elements);
    const name = form.elements["name"].value.trim();
    const email = form.elements["email"].value.trim();
    const password = form.elements["password"].value.trim();

    return {
        name,
        email,
        password,
    };
}

function sendData(data) {
    return Promise.reject("Service unuvailable now!");
}
