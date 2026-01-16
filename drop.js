const characters = document.querySelectorAll(".character");

const dropLeft = document.getElementById("dropLeft");
const dropRight = document.getElementById("dropRight");

let draggedCharacter = null;

characters.forEach((char) => {
    char.dataset.originalParent = char.parentElement.id;

    char.addEventListener("dragstart", (e) => {
        draggedCharacter = char;
        e.dataTransfer.effectAllowed = "move";

        setTimeout(() => (char.style.opacity = "0.5"), 0);
    });

    char.addEventListener("dragend", () => {
        draggedCharacter = null;
        char.style.opacity = "1";
    });

    char.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        const originalBank = document.getElementById(
            char.dataset.originalParent
        );

        if (char.parentElement !== originalBank) {
        if (char.parentElement === dropLeft) {
            character1 = null;
            window.character1 = null;
        }
        if (char.parentElement === dropRight) {
            character2 = null;
            window.character2 = null;
        }

            originalBank.appendChild(char);
            char.style.position = "relative";
            char.style.top = "0";
            char.style.left = "0";
        }
    });
});

[dropLeft, dropRight].forEach((zone) => {
    zone.addEventListener("dragover", (e) => {
        e.preventDefault();
        zone.style.background = "rgba(189,157,242,0.3)";
    });

    zone.addEventListener("dragleave", () => {
        zone.style.background = "rgba(189,157,242,0.0)";
    });

    zone.addEventListener("drop", (e) => {
        e.preventDefault();
        if (!draggedCharacter) return;

        if (zone === dropLeft && character1) {
            document
                .getElementById(character1.dataset.originalParent)
                .appendChild(character1);
        }
        if (zone === dropRight && character2) {
            document
                .getElementById(character2.dataset.originalParent)
                .appendChild(character2);
        }

        zone.appendChild(draggedCharacter);

        if (zone === dropLeft) {
            character1 = draggedCharacter;
            window.character1 = character1;
        }
        if (zone === dropRight) {
            character2 = draggedCharacter;
            window.character2 = character2;
        }

        zone.style.background = "rgba(189,157,242,0.0)";
        draggedCharacter.style.opacity = "1";
        draggedCharacter.style.position = "relative";
        draggedCharacter.style.top = "0";
        draggedCharacter.style.left = "0";
        
        // Check if we can navigate to compare page
        if (typeof checkAndNavigate === 'function') {
            checkAndNavigate();
        }
    });
});
