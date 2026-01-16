console.log("app.js загружен");

// ===== безопасная инициализация Telegram =====
let tg = null;

if (window.Telegram && window.Telegram.WebApp) {
    tg = window.Telegram.WebApp;
    tg.ready();
    console.log("Открыто внутри Telegram");
} else {
    console.warn("Открыто НЕ внутри Telegram");
}

// ===== DOM элементы =====
const spinButton = document.getElementById("spinButton");
const resultDiv = document.getElementById("result");

if (!spinButton) {
    console.error("Кнопка spinButton не найдена");
} else {
    console.log("Кнопка найдена");

    spinButton.addEventListener("click", async () => {
        console.log("Кнопка нажата");
        resultDiv.textContent = "Крутим...";

        if (!tg) {
            resultDiv.textContent = "Откройте мини-апп через Telegram";
            return;
        }

        try {
            const response = await fetch("/api/spin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    chatId: tg.initDataUnsafe?.user?.id
                })
            });

            const data = await response.json();
            resultDiv.textContent = "Ваш приз: " + (data.prize || "Сюрприз 🎁");
        } catch (e) {
            console.error("Ошибка запроса", e);
            resultDiv.textContent = "Ошибка сервера";
        }
    });
}
