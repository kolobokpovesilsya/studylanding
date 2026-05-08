import { debounce, validateEmail } from "../../utils/utils";
import { getAlertElement } from "../alert/alert";
import { openModalById } from "../modal/modal";

const links = document.querySelector(".footer__links");
const form = document.querySelector(".footer__search-group");
const invalidMessage = form.querySelector(".footer__invalid-email");
const email = form.elements["email"];
const subscribeBtn = form.elements["subscribe"];
async function handleSubscribe() {
    const isEmail = validateEmailHandler(email.value);
    if (!isEmail) {
        return;
    }
    let alertElement;
    try {
        const result = await makeSubscribeRequest();
        alertElement = getAlertElement(result, "success");
    } catch (e) {
        if (typeof e == "string") {
            alertElement = getAlertElement(e, "danger");
        } else {
            alertElement = getAlertElement("Fail to sign up!", "danger");
        }
    } finally {
        openModalById("blank-modal", {
            closeTimeout: 1500,
            message: alertElement,
        });
    }
}
function handleInputChange(e) {
    validateEmailHandler(e.target.value);
}
function validateEmailHandler(value) {
    const isEmpty = !value?.trim();
    if (isEmpty) {
        email.classList.remove("input--invalid");
        invalidMessage.classList.remove("invalid-message--show");
        subscribeBtn.disabled = true;
        return false;
    }
    const isEmail = validateEmail(value);
    if (isEmail) {
        email.classList.remove("input--invalid");
        invalidMessage.classList.remove("invalid-message--show");
        subscribeBtn.disabled = false;
    } else {
        email.classList.add("input--invalid");
        invalidMessage.classList.add("invalid-message--show");
        subscribeBtn.disabled = true;
    }
    return isEmail;
}
function makeSubscribeRequest() {
    return Promise.resolve("Successfully subscribed!");
}
export function initFooter() {
    subscribeBtn.onclick = handleSubscribe;
    email.oninput = debounce(handleInputChange, 400);
    links.addEventListener("click", (e) => {
        e.preventDefault();
        const alertElement = getAlertElement("Coming soon!", "info");
        openModalById("blank-modal", {
            closeTimeout: 1500,
            message: alertElement,
        });
    });
}
