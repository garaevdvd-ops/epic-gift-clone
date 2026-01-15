const spinButton = document.getElementById("spinButton");
const wheel = document.getElementById("wheel");
const resultDiv = document.getElementById("result");

const itemWidth = 150;
const itemMargin = 10;
const items = document.getElementsByClassName("item");
const totalItems = items.length;

spinButton.addEventListener("click", async () => {
    spinButton.disabled = true;
    resultDiv.textContent = "";

    let prizeName = "";
    let prizeIndex = 0;

    try {
        // ← замените на IP вашего сервера
        const response = await fetch("http://45.144.222.43:3000/spin");
        const data = await response.json();

        prizeName = data.prize || "Сюрприз!";
        prizeIndex = typeof data.index === "number" ? data.index : Math.floor(Math.random() * totalItems);
    } catch (err) {
        prizeIndex = Math.floor(Math.random() * totalItems);
        prizeName = items[prizeIndex].alt || "Сюрприз!";
    }

    let position = 0;
    let speed = 40 + Math.random() * 20;
    const deceleration = 0.97;

    const centerOffset = wheel.parentElement.offsetWidth / 2 - itemWidth / 2;
    const targetPosition = prizeIndex * (itemWidth + itemMargin) - centerOffset;

    const animate = () => {
        let diff = targetPosition - (-position);
        speed *= deceleration;

        if (diff > 0.5) {
            position -= speed;
            wheel.style.transform = `translateX(${position}px)`;
            requestAnimationFrame(animate);
        } else {
            wheel.style.transform = `translateX(${-targetPosition}px)`;
            resultDiv.textContent = "Ваш приз: " + prizeName;
            spinButton.disabled = false;
        }
    };

    animate();
});
