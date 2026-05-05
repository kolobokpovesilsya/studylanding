import { openModalById } from "../modal/modal";

export function closeSignupModalHandler(modal, status) {
    console.log("close===", status);
    switch (status) {
        case "ok":
            const data = getData(modal);
            console.log("data===", data);
            sendData(data);
            openModalById("send-assessment-modal", {
                closeTimeout: 1500,
            });
            return;
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

function sendData(data) {}
