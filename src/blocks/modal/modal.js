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
                    console.log("open modal");
                    this.openModal(modalId);
                };
            }
        });
        document.addEventListener("open-modal", this.handleOpenModalEvent);
    }
    valueToString=(value)=>{
        if(typeof value == 'number'){
            return value.toString()
        }
        if(typeof value=='undefined' || value==null){
            return ''
        }
        return value.trim()
    }
    checkValidationRule = (input,rule)=>{
        const value = input.value
        switch(rule){
            case 'mandatory':
                return !this.valueToString(value)?false:true
            case 'range':
                if(typeof value == 'undefined' || value==null){
                    return false
                }
                const converted = +value
                if(isNaN(converted)){
                    return false
                }
                const min = data-validation-min
                return !this.valueToString(value)?false:true
            default:
                return false    
        }
    }
    checkFormValidity=(modalId)=>{
        const modal = this.modalMap[modalId]
        const validationInputs = modal.querySelectorAll('[data-validate]')
        if(!validationInputs.length){
            return true
        }
        
        for(let input of Array.from(validationInputs)){
            const fieldValid = this.checkFieldValidity(modalId,input)
            console.log('fieldValid===',fieldValid,input,)
            if(!fieldValid){
                return false
            }
        }
        return true
    }
    checkFieldValidity=(modalId,input)=>{
          const modal = this.modalMap[modalId]
            const id =input.id 
            if(!id){
                return true
            }
            const messages = modal.querySelectorAll(`[data-for="${id}"`)
              console.log('inpiut===',messages,`[data-for="${id}"`)
            if(!messages.length){
                return true
            }   
           
            for(let message of messages){
                const rule =  message.getAttribute('data-validation-rule')
                const result =  this.checkValidationRule(input,rule)
                if(result){
                    message.classList.remove('modal__validation-message--show')
                    continue
                }
                message.classList.add('modal__validation-message--show')
                return false
            }  
            return true 
    }
    setupInputValidation=(modalId)=>{
        const modal = this.modalMap[modalId]
        const validationInputs = modal.querySelectorAll('[data-validate]')
        console.log('validationInputs===',modalId,modal,validationInputs)
        if(!validationInputs.length){
            return true
        }
        validationInputs.forEach(input=>{
            input.addEventListener('input',(e)=>{
                this.checkFieldValidity(modalId,e.target)
                console.log('change====')
            })
        })
    }
    handleOnOk=(modalId,e)=>{
        const isFormValid = this.checkFormValidity(modalId)
        if(!isFormValid){
            return 
        }
        this.closeModal.bind(this, modalId, "ok");
    }
    processModal = (modal) => {
        console.log('proces===')
        this.modalMap[modal.id] = modal;
        const okBtn = modal.querySelector(".modal__ok");
        const closeBtn = modal.querySelector(".modal__close");
        const cancelBtn = modal.querySelector(".modal__cancel");
        if (okBtn) {
            okBtn.onclick = this.handleOnOk.bind(this, modal.id);
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

        this.setupInputValidation(modal.id)
        
    }
    handleOpenModalEvent = (e) => {
        const { id, closeCallback, closeTimeout } = e.detail;
        console.log("event===", e);
        this.openModal(id);
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

export function openModalById(id, options) {
    const customEvent = new CustomEvent("open-modal", {
        detail: {
            id,
            ...options,
        },
    });
    document.dispatchEvent(customEvent);
}
