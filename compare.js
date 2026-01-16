const characterImageMap = {
    Grendel: { path: "./characters/grendel.jpg", objectPosition: "top" },
    "The Danes": { path: "./characters/dane.jpg", objectPosition: "center" },
    Frankenstein: {
        path: "./characters/frankenstein.jpg",
        objectPosition: "center",
    },
    "The Creature": {
        path: "./characters/creature.jpg",
        objectPosition: "top",
    },
    Neville: { path: "./characters/neville.jpg", objectPosition: "top" },
    "The New Society": {
        path: "./characters/society.jpg",
        objectPosition: "center",
    },
    Mother: { path: "./characters/mother.jpg", objectPosition: "top" },
    Norman: { path: "./characters/norman.jpg", objectPosition: "center" },
    Marion: { path: "./characters/marion.jpg", objectPosition: "center" },
};

let comparisons; // variable to store JSON
let analyses;

function createCharacterCard(characterName, imageId, nameId) {
    const characterInfo = characterImageMap[characterName];

    if (characterInfo) {
        const img = document.getElementById(imageId);
        const name = document.getElementById(nameId);

        img.src = characterInfo.path;
        img.alt = characterName;
        if (characterInfo.objectPosition === "top") {
            img.style.objectPosition = "top";
        }

        name.textContent = characterName;
    } else {
        document.getElementById(imageId).src = "";
        document.getElementById(nameId).textContent =
            characterName || "Unknown";
    }
}

const urlParams = new URLSearchParams(window.location.search);

const character1 = urlParams.get("character1");
const character2 = urlParams.get("character2");
const scale = urlParams.get("scale");

if (character1 && character2 && scale) {
    createCharacterCard(character1, "char1Image", "char1Name");
    createCharacterCard(character2, "char2Image", "char2Name");

    document.querySelector(
        "#title"
    ).innerHTML = `Character Comparison: ${character1} vs. ${character2} from a ${scale} perspective`;

    judgeCharacters();
} else {
    document.getElementById("char1Name").textContent = "Missing character 1";
    document.getElementById("char2Name").textContent = "Missing character 2";
    document.getElementById("scaleDisplay").textContent = "Missing scale";

    setTimeout(() => {
        window.location.href = "index.html";
    }, 3000);
}

async function judgeCharacters() {
    await fetch("comparisons.json")
        .then((response) => response.json())
        .then((data) => {
            comparisons = data;
            console.log("comparisons loaded:", comparisons);
        })
        .catch((error) => console.error("Error loading JSON:", error));
    await fetch("characters.json")
        .then((response) => response.json())
        .then((data) => {
            analyses = data;
            console.log("analyses loaded:", analyses);
        })
        .catch((error) => console.error("Error loading JSON:", error));

    const judgment = comparisons[character1][character2][scale];
    const analysis1 = analyses[character1][scale];
    const analysis2 = analyses[character2][scale];

    if (judgment.verdict == 0) {
        //flat
        document.querySelector("#character1Display").classList.add("flatLeft");
        document.querySelector("#character2Display").classList.add("flatRight");
    } else if (judgment.verdict == 1) {
        //left
        document.querySelector("#scalesImage").src = "leanLeft.png";
        document
            .querySelector("#character1Display")
            .classList.add("guiltyLeft");
        document
            .querySelector("#character2Display")
            .classList.add("notGuiltyRight");
    } else if (judgment.verdict == 2) {
        //right
        document.querySelector("#scalesImage").src = "leanRight.png";
        document
            .querySelector("#character1Display")
            .classList.add("notGuiltyLeft");
        document
            .querySelector("#character2Display")
            .classList.add("guiltyRight");
    }

    document.querySelector("#char1Info").innerHTML = analysis1.message;
    document.querySelector("#char2Info").innerHTML = analysis2.message;
    if (judgment.message == "") {
        if (judgment.verdict == 0) {
            //flat
            document.querySelector(
                "#finalJudgment"
            ).innerHTML = `Final Judgment: The scale deems both ${character1} and ${character2} equally guilty based on the reasons articulated above.`;
        } else if (judgment.verdict == 1) {
            //left
            document.querySelector(
                "#finalJudgment"
            ).innerHTML = `Final Judgment: The scale deems ${character1} more guilty than ${character2} from a ${scale} perspective based on the reasons articulated above.`;
        } else if (judgment.verdict == 2) {
            //right
            document.querySelector(
                "#finalJudgment"
            ).innerHTML = `Final Judgment: The scale deems ${character2} more guilty than ${character1} from a ${scale} perspective based on the reasons articulated above.`;
        }
    } else {
        document.querySelector(
            "#finalJudgment"
        ).innerHTML = `Final Judgment: ${judgment.message}`;
    }
}

window.character1 = character1;
window.character2 = character2;
window.scale = scale;
