export class MenuController {
    constructor(menuElement) {
        const dropdownItems = menuElement.querySelectorAll(
            ".menu__item:has(.menu__dropdown)",
        );

        Array.from(dropdownItems).forEach((item) => {
            console.log("dropdownItems", item);
            this.processDropdownItem(item);
        });
        document.addEventListener("click", this.handleMenuItemClick);
    }

    handleMenuItemClick(e) {
        const target = e.target;

        const menuItem = target.closest(".menu__item");
        console.log("menuItem===", target, menuItem);
        if (!menuItem) {
            const menuList = document.querySelectorAll(".menu__dropdown");

            return;
        }
        const dropdownMenu = menuItem.parentElement;
        if (!dropdownMenu.classList.contains("menu__dropdown")) {
            console.log("dropdownMenu===", dropdownMenu);
            return;
        }
        if (dropdownMenu.classList.contains("menu__dropdown--close-on-click")) {
            dropdownMenu.classList.remove("menu__dropdown--opened");
        }

        // menu__dropdown--close-on-click
    }
    processDropdownItem(dropdownItem) {
        const arrow = document.createElement("div");
        arrow.classList.add("menu__item-arrow");

        dropdownItem.appendChild(arrow);
        arrow.onclick = this.toggleDropdownMenu.bind(this, dropdownItem);
    }
    toggleDropdownMenu = (dropdownElement, e) => {
        const menuElement = Array.from(dropdownElement.children).find((ch) =>
            ch.classList.contains("menu__dropdown"),
        );
        console.log("click arrow", dropdownElement.children, menuElement);
        if (!menuElement) {
            return;
        }
        // const isOpen = menuElement.classList.contains('menu--opened')
        menuElement.classList.toggle("menu__dropdown--opened");
    };
}
