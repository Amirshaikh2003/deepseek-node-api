export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({
      message: "Use POST request"
    });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      error: "Message is required"
    });
  }

  // =========================
  // 🔥 STEP 1: TRY GROQ
  // =========================
  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "user", content: message }
        ]
      })
    });

    const groqData = await groqRes.json();

    if (groqData?.choices?.length > 0) {
      return res.status(200).json({
        reply: groqData.choices[0].message.content,
        provider: "groq"
      });
    }

    // Agar response empty hai to fallback
    throw new Error("Groq no response");

  } catch (groqError) {
    console.log("Groq failed → switching to Gemini");

    // =========================
    // 🔥 STEP 2: GEMINI FALLBACK
    // =========================
    try {
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

      let reply = "No response";

      if (geminiData.candidates && geminiData.candidates.length > 0) {
        const parts = geminiData.candidates[0]?.content?.parts;
        if (parts && parts.length > 0) {
          reply = parts.map(p => p.text).join(" ");
        }
      }

      return res.status(200).json({
        reply,
        provider: "gemini"
      });

    } catch (geminiError) {
      return res.status(500).json({
        error: "Both Groq and Gemini failed",
        details: {
          groq: groqError.message,
          gemini: geminiError.message
        }
      });
    }
  }
}
