document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('animationCanvas');
    const ctx = canvas.getContext('2d');

    const text = "ReDACT";
    const fontSize = 130;  // Increase the font size
    const letters = text.split("");
    const blurAmount = 13;
    const letterInterval = 250; // Faster blurring interval
    let currentIndex = 0;

    // Set up the font
    ctx.font = `${fontSize}px Arial`;
    ctx.fontWeight = 'bold';  // Make the text bold
    ctx.fillStyle = "black";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    // Calculate initial position
    const startX = canvas.width / 2 - (ctx.measureText(text).width / 2);
    const startY = canvas.height / 2;

    function drawTextWithBlur() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        letters.forEach((letter, index) => {
            ctx.save();
            if (index < currentIndex && letter !== "R" && letter !== "C" && letter !== "A") {
                ctx.filter = `blur(${blurAmount}px)`;
            }
            ctx.fillText(letter, startX + ctx.measureText(text.substring(0, index)).width, startY);
            ctx.restore();
        });

        if (currentIndex < letters.length) {
            currentIndex++;
            setTimeout(drawTextWithBlur, letterInterval);
        }
    }

    drawTextWithBlur();

});
