export class ModalController {
    modalMap = {};
    onCloseEvent;
    constructor(onClose) {
        this.onCloseEvent = onClose;
        const modalList = document.querySelectorAll(".modal");
        const modalInvokerList = document.querySelectorAll("[data-bind-modal]");
        modalList.forEach((modal) => {
            this.modalMap[modal.id] = modal;
            const okBtn = modal.querySelector(".modal__ok");
            const closeBtn = modal.querySelector(".modal__close");
            const cancelBtn = modal.querySelector(".modal__cancel");
            if (okBtn) {
                okBtn.onclick = this.closeModal.bind(this, modal.id, "ok");
            }
            if (closeBtn) {
                closeBtn.onclick = this.closeModal.bind(
                    this,
                    modal.id,
                    "close",
                );
            }
            if (cancelBtn) {
                cancelBtn.onclick = this.closeModal.bind(
                    this,
                    modal.id,
                    "close",
                );
            }
            modal.onclick = this.onModalClick.bind(this, modal.id);
            modal.addEventListener(
                "wheel",
                (e) => {
                    e.preventDefault();
                },
                {},
            );
        });
        modalInvokerList.forEach((invoker) => {
            const modalId = invoker.getAttribute("data-bind-modal");
            const modal = this.modalMap[modalId];
            if (modal) {
                invoker.onclick = () => {
                    console.log("open modal");
                    this.openModal(modalId);
                };
            }
        });
    }
    onModalClick = (modalId, e) => {
        const modalContent = e.target.closest(".modal__content");
        if (!modalContent) {
            this.closeModal(modalId);
        }
    };
    openModal(id) {
        const modal = this.modalMap[id];
        if (!modal) {
            return;
        }
        if (modal.classList.contains("modal--opened")) {
            return;
        }
        modal.classList.add("modal--opened");
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
}
