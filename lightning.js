const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const flash = document.getElementById("flash");
const container = document.getElementById("container");
const startOverlay = document.getElementById("startOverlay");
const scalesImage = document.getElementById("scalesImage");
const thunder = document.getElementById("thunder");
const thunderFull = document.getElementById("thunder-full");
const words = [
    document.getElementById("w1"),
    document.getElementById("w2"),
    document.getElementById("w3"),
];

const lightningStrikeOffset = 5;
const lightningBoltLength = 5;
let lightning = [];
let audioUnlocked = false;

//Lightning implementation from https://dev.to/soorajsnblaze333/make-it-flash-lightning-with-canvas-43nh
const createVector = (x, y) => ({ x, y });

class Lightning {
    constructor(x1, y1, x2, y2, thickness, opacity) {
        this.start = createVector(x1, y1);
        this.end = createVector(x2, y2);
        this.thickness = thickness;
        this.opacity = opacity;
    }
    draw() {
        ctx.beginPath();
        ctx.moveTo(this.start.x, this.start.y);
        ctx.lineTo(this.end.x, this.end.y);
        ctx.lineWidth = this.thickness;
        ctx.strokeStyle = `rgba(255,255,255,${this.opacity})`;
        ctx.shadowBlur = 20;
        ctx.shadowColor = "#bd9df2";
        ctx.stroke();
        ctx.closePath();
    }
}

const clearCanvas = () => ctx.clearRect(0, 0, canvas.width, canvas.height);

const getWordCenter = (word) => {
    const rect = word.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
};

const createLightningToWord = (word) => {
    lightning = [];
    const target = getWordCenter(word);
    let x1 = target.x + (Math.random() * 40 - 20);
    let y1 = 0;
    let x2 = target.x + (Math.random() * 20 - 10);
    let y2 = y1 + lightningBoltLength;

    lightning.push(new Lightning(x1, y1, x2, y2, 3, 1));

    while (y2 < target.y) {
        const last = lightning[lightning.length - 1];
        const nextX =
            last.end.x +
            (Math.random() * lightningStrikeOffset * 2 - lightningStrikeOffset);
        const nextY = last.end.y + lightningBoltLength;
        lightning.push(
            new Lightning(last.end.x, last.end.y, nextX, nextY, 3, 1)
        );
        x2 = nextX;
        y2 = nextY;
    }
};

const animate = () => {
    clearCanvas();
    for (let i = 0; i < lightning.length; i++) {
        lightning[i].opacity -= 0.02;
        lightning[i].thickness -= 0.05;
        if (lightning[i].thickness < 1) lightning[i].thickness = 1;
        lightning[i].draw();
    }
    requestAnimationFrame(animate);
};

requestAnimationFrame(animate);

const unlockAudio = () => {
    if (audioUnlocked) return;
    audioUnlocked = true;

    thunder
        .play()
        .then(() => {
            thunder.pause();
            thunder.currentTime = 0;
        })
        .catch(() => {});
    thunderFull
        .play()
        .then(() => {
            thunderFull.pause();
            thunderFull.currentTime = 0;
        })
        .catch(() => {});
};

const playAudio = (audioElement) => {
    if (!audioUnlocked) {
        unlockAudio();

        setTimeout(() => {
            audioElement.currentTime = 0;
            audioElement
                .play()
                .catch((err) => console.log("Audio play failed:", err));
        }, 100);
    } else {
        audioElement.currentTime = 0;
        audioElement
            .play()
            .catch((err) => console.log("Audio play failed:", err));
    }
};

const strikeWord = (word, last = false) => {
    createLightningToWord(word);
    flash.classList.add("active");
    container.classList.add("shake");

    if (!last) {
        playAudio(thunder);
    } else {
        setTimeout(() => {
            playAudio(thunderFull);
        }, 100);
    }

    word.classList.add("show");

    setTimeout(() => {
        flash.classList.remove("active");
        container.classList.remove("shake");
    }, 400);
};

const startSequence = () => {
    unlockAudio();
    startOverlay.classList.add("hidden");

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            let delay = 800;
            words.forEach((word, i) => {
                setTimeout(() => {
                    strikeWord(word, i === words.length - 1);

                    if (i === words.length - 1) {
                        setTimeout(() => {
                            strikesFinished();
                        }, 500);
                    }
                }, delay);
                delay += 1000;
            });
        });
    });
};

const skipButton = document.getElementById("skipIntro");

const skipIntro = () => {
    let highestId = setTimeout(() => {});
    for (let i = 0; i <= highestId; i++) clearTimeout(i);

    words.forEach((word) => word.classList.add("show"));

    lightning = [];
    clearCanvas();

    thunder.pause();
    thunderFull.pause();
    thunder.currentTime = 0;
    thunderFull.currentTime = 0;

    strikesFinished();

    startOverlay.classList.add("hidden");
};

skipButton.addEventListener("click", skipIntro);

function strikesFinished() {
    container.classList.add("move-to-top");
    scalesImage.classList.add("fade-in");

    const characterBankLeft = document.getElementById("characterBankLeft");
    const characterBankRight = document.getElementById("characterBankRight");
    const scales = document.querySelector("#scales");

    document.querySelector("#canvas").style.zIndex = -1;

    setTimeout(() => {
        characterBankLeft.classList.add("show");
        characterBankRight.classList.add("show");

        scales.classList.add("show");
    }, 600);

    setTimeout(() => {
        if (!skipped) {
            window.alert(
                "Please drag two characters onto each arm of the scale and select a criterion at the bottom. You can right click a placed character to remove them from the scale."
            );
        }
    }, 2000);
}

let skipped;

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("skipIntro") === "true") {
    skipped = true;
    skipIntro(); // automatically skip intro
}

document
    .querySelector(".start-message")
    .addEventListener("click", startSequence);
