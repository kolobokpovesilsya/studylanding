export class MenuController{
    constructor(menuElement){
      const dropdownItems = menuElement.querySelectorAll('.menu__item:has(.menu)')  
             
        Array.from(dropdownItems).forEach(item=>{
             console.log('dropdownItems',item)
            this.processDropdownItem(item)
        })
    }
    processDropdownItem(dropdownItem){
        const arrow = document.createElement('div')
        arrow.classList.add('menu__item-arrow') 
        
        dropdownItem.appendChild(arrow)
        arrow.onclick = this.toggleDropdownMenu.bind(this,dropdownItem)
    }
    toggleDropdownMenu=(dropdownElement,e)=>{
       
        const menuElement = Array.from(dropdownElement.children).find(ch=>ch.classList.contains('menu'))
         console.log('click arrow',dropdownElement.children,menuElement)
        if(!menuElement){
            return 
        }
        // const isOpen = menuElement.classList.contains('menu--opened')
        menuElement.classList.toggle('menu--opened')
    }
}