async function fetchQuote() {
    try {
        const response = await fetch("https://api.quotable.io/random");
        const data = await response.json();
        return data.content;
    } catch (error) {
        console.error("Error fetching quote:", error);
        return "Could not fetch quote. Try again.";
    }
}

let startTime = null;
let currentQuote = "";

async function newGame() {
    currentQuote = await fetchQuote();
    document.getElementById("quote").textContent = currentQuote;
    document.getElementById("input-box").value = "";
    document.getElementById("popup").style.display = "none";
    document.getElementById("input-box").focus();
    startTime = null;
}

document.getElementById("input-box").addEventListener("input", function() {
    if (!startTime) {
        startTime = new Date().getTime(); // Start timer on first keystroke
    }
    highlightKeys(this.value);
});

function generateKeyboard() {
    const keyboardLayout = [
        "1234567890-=",
        "qwertyuiop[]\\",
        "asdfghjkl;'",
        "zxcvbnm,./"
    ];
    const keyboard = document.getElementById("keyboard");
    keyboard.innerHTML = "";
    keyboardLayout.forEach(row => {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("row");
        row.split("").forEach(letter => {
            const keyDiv = document.createElement("div");
            keyDiv.classList.add("key");
            keyDiv.textContent = letter;
            keyDiv.id = `key-${letter}`;
            rowDiv.appendChild(keyDiv);
        });
        keyboard.appendChild(rowDiv);
    });
}

function highlightKeys(typedText) {
    document.querySelectorAll(".key").forEach(key => key.classList.remove("active"));

    const lastChar = typedText.slice(-1).toLowerCase(); // Ensure lowercase matching
    const keyElement = document.getElementById(`key-${lastChar}`);

    if (keyElement) {
        keyElement.classList.add("active");

        // Brief highlight effect for touch users
        setTimeout(() => keyElement.classList.remove("active"), 200);
    }
}



function calculateResults() {
    if (!startTime) return; // Prevent calculation if typing never started
    let endTime = new Date().getTime();
    let timeTaken = (endTime - startTime) / 1000; // Time in seconds
    let wordsTyped = document.getElementById("input-box").value.trim().split(" ").length;
    let speed = Math.round((wordsTyped / timeTaken) * 60) || 0;
    
    let correctChars = 0;
    let typedText = document.getElementById("input-box").value;
    for (let i = 0; i < Math.min(typedText.length, currentQuote.length); i++) {
        if (typedText[i] === currentQuote[i]) {
            correctChars++;
        }
    }
    let accuracy = ((correctChars / currentQuote.length) * 100).toFixed(2) || 0;
    
    document.getElementById("popup-result").innerHTML = 
        `<strong>Speed:</strong> ${speed} WPM<br><strong>Accuracy:</strong> ${accuracy}%<br><strong>Time Taken:</strong> ${timeTaken.toFixed(2)} seconds`;
    document.getElementById("popup").style.display = "block";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

generateKeyboard();
newGame();
