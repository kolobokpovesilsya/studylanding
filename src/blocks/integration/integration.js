import { Virtualizer } from "../../lib/virtualize/Virtualizer";
import { openModalById } from "../modal/modal";

const integrationModalBtn = document.querySelector(".integration__btn");

function onIntegrationModalOpen(modal) {
    console.log("modal", modal);
    const platformList = [
        "assets/integration/platform1.png",
        "assets/integration/platform2.png",
        "assets/integration/platform3.png",
        "assets/integration/platform4.png",
    ];

    const grid = modal.querySelector(".integration__grid");
    requestAnimationFrame(() => {
        for (let i = 0, j = 0; i < platformList.length * 3; i++, j++) {
            // for (let i = 0, j = 0; i < platformList.length * 50; i++, j++) {
            if (j == platformList.length) {
                j = 0;
                // break;
            }
            const platformUrl = platformList[j];
            const img = document.createElement("img");
            img.src = platformUrl;
            grid.appendChild(img);
        }
        // const images = grid.querySelectorAll('img')
        requestAnimationFrame(() => {
            new Virtualizer(grid);
        });
    });
}

export function initIntegration() {
    if (integrationModalBtn) {
        integrationModalBtn.onclick = () => {
            openModalById("integration-modal", {
                openCallback: onIntegrationModalOpen,
            });
            // integration-modal
        };
    }
}
