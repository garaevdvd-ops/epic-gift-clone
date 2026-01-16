// ===== Telegram Mini App =====
const tg = window.Telegram?.WebApp;

if (tg) {
    tg.ready();
    console.log("Telegram WebApp готов!");
    console.log("ID пользователя:", tg.initDataUnsafe?.user?.id);
} else {
    alert("Откройте мини-приложение через Telegram для корректной работы.");
}

// ===== DOM элементы =====
const spinButton = document.getElementById("spinButton");
const wheel = document.getElementById("wheel");
const resultDiv = document.getElementById("result");

// ===== параметры рулетки =====
const itemWidth = 150;
const itemMargin = 10;
const items = document.getElementsByClassName("item");
const totalItems = items.length;

// ===== обработка кнопки "Крутить" =====
spinButton.addEventListener("click", async () => {
    spinButton.disabled = true;
    resultDiv.textContent = "";

    let prizeName = "Сюрприз!";
    let prizeIndex = Math.floor(Math.random() * totalItems);

    try {
        // 🔥 ВАЖНО: отправляем POST на ваш endpoint /api/spin
        const response = await fetch("/api/spin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chatId: tg?.initDataUnsafe?.user?.id
            })
        });

        if (response.ok) {
            const data = await response.json();

            if (typeof data.index === "number") {
                prizeIndex = data.index;
            }

            if (data.prize) {
                prizeName = data.prize;
            }
        } else {
            console.warn("Ошибка запроса /api/spin:", response.status);
        }
    } catch (e) {
        console.error("Ошибка запроса:", e);
    }

    // ===== Анимация рулетки =====
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
