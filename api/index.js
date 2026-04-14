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
  // 🔥 STEP 1: GROQ KEY 1
  // =========================
  try {
    const groq1 = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY_1}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-insant",
        messages: [{ role: "user", content: message }]
      })
    });

    const data1 = await groq1.json();

    if (data1?.choices?.length > 0) {
      return res.status(200).json({
        reply: data1.choices[0].message.content,
        provider: "groq-1"
      });
    }

    throw new Error("Groq1 failed");

  } catch (e1) {
    console.log("Groq1 failed → OpenRouter");

    // =========================
    // 🔥 STEP 2: OPENROUTER FREE
    // =========================
    try {
      const orRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://your-app.vercel.app",
          "X-Title": "AI Chatbot"
        },
        body: JSON.stringify({
          model: "openrouter/free",
          messages: [{ role: "user", content: message }]
        })
      });

      const data2 = await orRes.json();

      if (data2?.choices?.length > 0) {
        return res.status(200).json({
          reply: data2.choices[0].message.content,
          provider: "openrouter"
        });
      }

      throw new Error("OpenRouter failed");

    } catch (e2) {
      console.log("OpenRouter failed → Groq2");

      // =========================
      // 🔥 STEP 3: GROQ KEY 2
      // =========================
      try {
        const groq2 = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.GROQ_API_KEY_2}`
          },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [{ role: "user", content: message }]
          })
        });

        const data3 = await groq2.json();

        if (data3?.choices?.length > 0) {
          return res.status(200).json({
            reply: data3.choices[0].message.content,
            provider: "groq-2"
          });
        }

        throw new Error("Groq2 failed");

      } catch (e3) {
        return res.status(500).json({
          error: "All providers failed",
          details: {
            groq1: e1.message,
            openrouter: e2.message,
            groq2: e3.message
          }
        });
      }
    }
  }
}
