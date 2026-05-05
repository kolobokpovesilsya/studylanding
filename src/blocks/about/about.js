import { openModalById } from "../modal/modal";

export function closeAccessCodeModalHandler(modal, status) {
    switch (status) {
        case "ok":
            const data = getData(modal);
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
    const code = form.elements["code"].value.trim();
    return {
        code,
    };
}

function sendData(data) {}
