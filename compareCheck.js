let character1;
let character2;
let selection = "";

function checkAndNavigate() {
    const char1 = window.character1 || character1;
    const char2 = window.character2 || character2;
    const selectedScale = window.selection || selection;

    if (char1 && char2 && selectedScale !== "") {
        const char1Name = char1.querySelector(".name")?.textContent || "";
        const char2Name = char2.querySelector(".name")?.textContent || "";

        const params = new URLSearchParams({
            character1: char1Name,
            character2: char2Name,
            scale: selectedScale.toLowerCase(),
        });

        window.location.href = `compare.html?${params.toString()}`;
    }
}

window.checkAndNavigate = checkAndNavigate;
window.character1 = character1;
window.character2 = character2;
window.selection = selection;
