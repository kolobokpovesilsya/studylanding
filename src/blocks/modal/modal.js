export class ModalController {
    modalMap = {};
    onCloseEvent;
    constructor(onClose) {
        this.onCloseEvent = onClose;
        const modalList = document.querySelectorAll(".modal");
        const modalInvokerList = document.querySelectorAll("[data-bind-modal]");
        modalList.forEach(this.processModal);
        modalInvokerList.forEach((invoker) => {
            const modalId = invoker.getAttribute("data-bind-modal");
            const modal = this.modalMap[modalId];
            if (modal) {
                invoker.onclick = () => {
                    this.openModal(modalId);
                };
            }
        });
        document.addEventListener("open-modal", this.handleOpenModalEvent);
    }
    valueToString = (value) => {
        if (typeof value == "number") {
            return value.toString();
        }
        if (typeof value == "undefined" || value == null) {
            return "";
        }
        return value.trim();
    };
    valueToNumber = (value) => {
        if (typeof value == "number") {
            return value;
        }
        if (!value) {
            return;
        }
        const converted = +value;
        if (isNaN(converted)) {
            return;
        }
        return converted;
    };

    handleOnOk = (modalId, e) => {
        const isFormValid = this.checkFormValidity(modalId);
        if (!isFormValid) {
            return;
        }
        this.closeModal(modalId, "ok");
    };
    processModal = (modal) => {
        this.modalMap[modal.id] = modal;
        const okBtn = modal.querySelector(".modal__ok");
        const closeBtn = modal.querySelector(".modal__close");
        const cancelBtn = modal.querySelector(".modal__cancel");
        if (okBtn) {
            okBtn.onclick = this.handleOnOk.bind(this, modal.id);
        }
        if (closeBtn) {
            closeBtn.onclick = this.closeModal.bind(this, modal.id, "close");
        }
        if (cancelBtn) {
            cancelBtn.onclick = this.closeModal.bind(this, modal.id, "close");
        }
        modal.onclick = this.onModalClick.bind(this, modal.id);
        modal.addEventListener(
            "wheel",
            (e) => {
                e.preventDefault();
            },
            {},
        );

        this.setupInputValidation(modal.id);
    };
    handleOpenModalEvent = (e) => {
        const { id, closeCallback, closeTimeout, openCallback } = e.detail;
        this.openModal(id, openCallback);
        if (closeTimeout) {
            setTimeout(() => {
                this.closeModal(id);
            }, closeTimeout);
        }
    };
    onModalClick = (modalId, e) => {
        const modalContent = e.target.closest(".modal__content");
        if (!modalContent) {
            this.closeModal(modalId);
        }
    };
    openModal(id, openCallback) {
        const modal = this.modalMap[id];
        if (!modal) {
            return;
        }
        if (modal.classList.contains("modal--opened")) {
            return;
        }
        modal.classList.add("modal--opened");
        openCallback();
    }
    closeModal(id, status) {
        const modal = this.modalMap[id];
        if (!modal) {
            return;
        }
        if (!modal.classList.contains("modal--opened")) {
            return;
        }

        const shouldClose = this.onCloseEvent(id, status);
        if (shouldClose === false) {
            return;
        }
        modal.classList.remove("modal--opened");
    }
    checkValidationRule = (input, message) => {
        const rule = message.getAttribute("data-validation-rule");
        const value = input.value;
        switch (rule) {
            case "mandatory":
                return !this.valueToString(value) ? false : true;
            case "range":
                if (typeof value == "undefined" || value == null) {
                    return false;
                }
                const converted = this.valueToNumber(value);
                if (isNaN(converted)) {
                    console.warn(`${input.id} must be a number`);
                    return false;
                }
                const min = this.valueToNumber(
                    message.getAttribute("data-validation-min"),
                );
                const max = this.valueToNumber(
                    message.getAttribute("data-validation-max"),
                );
                if (min >= max) {
                    console.warn(
                        "Invalid range. Min should be smaller than max.",
                    );
                    return false;
                }
                let valid = true;
                if (typeof min == "number") {
                    valid = converted >= min;
                }
                if (typeof max == "number") {
                    valid &= converted <= min;
                }

                return valid;
            default:
                return false;
        }
    };
    checkFormValidity = (modalId) => {
        const modal = this.modalMap[modalId];
        const validationInputs = modal.querySelectorAll("[data-validate]");
        if (!validationInputs.length) {
            return true;
        }

        for (let input of Array.from(validationInputs)) {
            const fieldValid = this.checkFieldValidity(modalId, input);
            if (!fieldValid) {
                return false;
            }
        }
        return true;
    };
    checkFieldValidity = (modalId, input) => {
        const modal = this.modalMap[modalId];
        const id = input.id;
        if (!id) {
            return true;
        }
        const messages = modal.querySelectorAll(`[data-for="${id}"`);
        if (!messages.length) {
            return true;
        }

        for (let message of messages) {
            const result = this.checkValidationRule(input, message);
            if (result) {
                message.classList.remove("modal__validation-message--show");
                continue;
            }
            message.classList.add("modal__validation-message--show");
            return false;
        }
        return true;
    };
    setupInputValidation = (modalId) => {
        const modal = this.modalMap[modalId];
        const validationInputs = modal.querySelectorAll("[data-validate]");
        if (!validationInputs.length) {
            return true;
        }
        validationInputs.forEach((input) => {
            input.addEventListener("input", (e) => {
                this.checkFieldValidity(modalId, e.target);
            });
        });
    };
}

export function openModalById(id, options) {
    const customEvent = new CustomEvent("open-modal", {
        detail: {
            id,
            ...options,
        },
    });
    document.dispatchEvent(customEvent);
}
