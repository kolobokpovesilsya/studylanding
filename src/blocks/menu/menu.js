export class MenuController {
    constructor(menuElement) {
        const dropdownItems = menuElement.querySelectorAll(
            ".menu__item:has(.menu__dropdown)",
        );

        Array.from(dropdownItems).forEach((item) => {
            this.processDropdownItem(item);
        });
        document.addEventListener("click", this.handleClick.bind(this));
    }

    handleClick(e) {
        //Close all opened submenu first

        const target = e.target;

        const menuItem = target.closest(".menu__item");

        if (!menuItem) {
            this.closeOpenedSubmenu();
            const menuList = document.querySelectorAll(".menu__dropdown");
            return;
        }
        const submenu = menuItem.querySelector(":scope .menu__dropdown");
        this.closeOpenedSubmenu(submenu);
        //if menu item has submenu togle its expand state
        if (submenu) {
            e.preventDefault();

            submenu.classList.toggle("menu__dropdown--opened");
            return;
        }
        //If menu item doesnt have submenu go to parent
        const parent = menuItem.parentElement;
        //If parent is not submenu apply default behavior
        if (!parent.classList.contains("menu__dropdown")) {
            return;
        }
        //If menu item parent is submenu then close it if it has special close-on-click class
        // if (dropdownMenu.classList.contains("menu__dropdown--close-on-click")) {
        //     dropdownMenu.classList.remove("menu__dropdown--opened");
        // }

        // menu__dropdown--close-on-click
    }
    closeOpenedSubmenu(currentOpened) {
        const openedSubmenu = document.querySelectorAll(
            ".menu__dropdown--opened",
        );
        Array.from(openedSubmenu).forEach((sbmenu) => {
            if (
                sbmenu.classList.contains("menu__dropdown--opened") &&
                currentOpened != sbmenu
            ) {
                sbmenu.classList.remove("menu__dropdown--opened");
            }
        });
    }
    processDropdownItem(dropdownItem) {
        // const arrow = document.createElement("div");
        // arrow.classList.add("menu__item-arrow");
        // dropdownItem.appendChild(arrow);
        // arrow.onclick = this.toggleDropdownMenu.bind(this, dropdownItem);
    }
    toggleDropdownMenu = (dropdownElement, e) => {
        const menuElement = Array.from(dropdownElement.children).find((ch) =>
            ch.classList.contains("menu__dropdown"),
        );
        if (!menuElement) {
            return;
        }
        // const isOpen = menuElement.classList.contains('menu--opened')
        menuElement.classList.toggle("menu__dropdown--opened");
    };
}
