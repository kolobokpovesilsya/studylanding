
export class ModalController{
    modalMap={}
    constructor(){
        const modalList = document.querySelectorAll('.modal')
        const modalInvokerList = document.querySelectorAll('[data-bind-modal]')
        console.log('modalInvokerList',modalInvokerList)
        modalList.forEach(modal=>{
            this.modalMap[modal.id]=modal            
        })
        modalInvokerList.forEach(invoker=>{
            const modalId = invoker.getAttribute('data-bind-modal')            
            const modal=this.modalMap[modalId]
            if(modal){
                invoker.onclick=()=>{
                    console.log('open modal')
                    this.openModal(modalId)
                }
            }                        
        })
    }
    openModal(id){
        const modal = this.modalMap[id]
        if(!modal){
            return
        }
        if(modal.classList.contains('modal--opened')){
            return 
        }
        modal.classList.add('modal--opened')
    }
    closeModal(id){
        const modal = this.modalMap[id]
        if(!modal){
            return
        }
        if(!modal.classList.contains('modal--opened')){
            return 
        }
        modal.classList.remove('modal--opened')
    }

}