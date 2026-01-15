const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Подключаем статические файлы рулетки
app.use(express.static(__dirname));

// Список призов с шансами
const prizes = [
    { name: "10 монет", chance: 50 },
    { name: "Бонус", chance: 30 },
    { name: "Стикер", chance: 20 }
];

// JSON файл для хранения результатов игроков
const resultsFile = path.join(__dirname, 'results.json');

// Функция получения случайного приза
function getPrize() {
    const rand = Math.random() * 100;
    let sum = 0;
    for (let p of prizes) {
        sum += p.chance;
        if (rand <= sum) return p.name;
    }
}

// Маршрут для запроса выпадения приза
app.get('/spin', (req, res) => {
    const prize = getPrize();

    // Загружаем предыдущие результаты
    let results = {};
    if (fs.existsSync(resultsFile)) {
        results = JSON.parse(fs.readFileSync(resultsFile));
    }

    // Сохраняем новый результат (можно привязать к игроку, например req.ip)
    const user = req.ip;
    results[user] = prize;
    fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));

    res.json({ prize });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Miniapp running on port ${PORT}`);
});
