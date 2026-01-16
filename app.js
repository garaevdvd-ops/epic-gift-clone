let tg = null;

if (window.Telegram && window.Telegram.WebApp) {
    tg = window.Telegram.WebApp;
    tg.ready();

    console.log("Telegram WebApp готов!");
    console.log("ID пользователя:", tg.initDataUnsafe?.user?.id);
} else {
    alert("Откройте мини-приложение через Telegram");
}
const tg = window.Telegram.WebApp;
tg.ready();

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

    let prizeIndex = Math.floor(Math.random() * totalItems);
    let prizeName = "Сюрприз!";

    try {
        const response = await fetch("/api/spin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chatId: tg.initDataUnsafe?.user?.id
            })
        });

        if (response.ok) {
            const data = await response.json();
            if (typeof data.index === "number") prizeIndex = data.index;
            if (data.prize) prizeName = data.prize;
        }
    } catch (e) {
        console.error(e);
    }

    let position = 0;
    let speed = 40 + Math.random() * 20;
    const deceleration = 0.97;

    const centerOffset =
        wheel.parentElement.offsetWidth / 2 - itemWidth / 2;

    const targetPosition =
        prizeIndex * (itemWidth + itemMargin) - centerOffset;

    const animate = () => {
        const diff = targetPosition - (-position);
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
