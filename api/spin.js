import fetch from "node-fetch";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { chatId } = req.body;

        if (!chatId) {
            return res.status(400).json({ error: "No chatId" });
        }

        const response = await fetch("http://45.144.222.43:3000/spin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ chatId })
        });

        const data = await response.json();
        return res.status(200).json(data);

    } catch (err) {
        console.error("API /spin error:", err);
        return res.status(500).json({ error: "Server error" });
    }
}
