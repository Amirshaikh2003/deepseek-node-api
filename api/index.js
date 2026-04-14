// 🔥 GEMINI FALLBACK (FIXED)
const geminiRes = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: message }]
        }
      ]
    })
  }
);

const geminiData = await geminiRes.json();

// 🔍 DEBUG (temporary)
console.log("Gemini response:", JSON.stringify(geminiData));

let reply = "No response";

// ✅ Safe extraction
if (
  geminiData?.candidates &&
  geminiData.candidates.length > 0 &&
  geminiData.candidates[0]?.content?.parts
) {
  reply = geminiData.candidates[0].content.parts
    .map(p => p.text || "")
    .join("");
}

// ❗ Agar error object aaye
if (geminiData.error) {
  reply = "Gemini error: " + geminiData.error.message;
}
