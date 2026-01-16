console.log("app.js загружен");

let tg = null;
if (window.Telegram && window.Telegram.WebApp) {
    tg = window.Telegram.WebApp;
    tg.ready();
    console.log("Telegram WebApp OK");
} else {
    console.warn("НЕ Telegram WebApp");
}

const spinButton = document.getElementById("spinButton");
const resultDiv = document.getElementById("result");

if (!spinButton) {
    console.error("spinButton не найден");
} else {
    spinButton.addEventListener("click", async () => {
        console.log("Нажали крутить");

        if (!tg) {
            resultDiv.textContent = "Открой через Telegram";
            return;
        }

        resultDiv.textContent = "Крутим...";

        try {
            const response = await fetch("/api/spin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chatId: tg.initDataUnsafe.user.id
                })
            });

            const data = await response.json();
            resultDiv.textContent = "Ваш приз: " + data.prize;
        } catch (e) {
            console.error(e);
            resultDiv.textContent = "Ошибка сервера";
        }
    });
}
