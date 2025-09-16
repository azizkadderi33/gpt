import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());

app.get("/chat", async (req, res) => {
    const userText = req.query.text;
    if (!userText) return res.json({ error: "❌ يجب إدخال نص في المعامل `text`" });

    try {
        // إرسال طلب إلى Gemini API بناءً على نموذج HTML
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCtLuuB45zfZ8-p0AazvirmmB6PpvP8vyk", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: userText }],
                    },
                ],
            }),
        });

        const rawResponse = await response.text();
        const data = JSON.parse(rawResponse);

        if (!response.ok) {
            res.json({ error: `❌ حدث خطأ: ${data.error?.message || "مشكلة في الاتصال."}` });
            return;
        }

        const candidate = data.candidates && data.candidates[0];
        if (candidate && candidate.content && candidate.content.parts) {
            const reply = candidate.content.parts
                .map((part) => part.text)
                .join("\n");
            res.json({ reply: reply });
        } else {
            res.json({ error: "لم يتم العثور على رد مناسب." });
        }
    } catch (error) {
        res.json({ error: "❌ حدث خطأ أثناء الاتصال!" });
    }
});

// تشغيل الخادم على المنفذ 3000
app.listen(3000, "0.0.0.0", () => console.log("✅ الخادم يعمل على Replit!"));
