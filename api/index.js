const PROVIDERS = [
  {
    name: "groq-1",
    type: "groq",
    key: process.env.GROQ_API_KEY_1
  },
  {
    name: "groq-2",
    type: "groq",
    key: process.env.GROQ_API_KEY_2
  },
  {
    name: "openrouter",
    type: "openrouter",
    key: process.env.OPENROUTER_API_KEY
  }
];

// 🔀 Shuffle providers (load balancing)
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// 🧠 Common system prompt (ENGLISH ONLY)
const SYSTEM_PROMPT = `
You are ClimbUP AI, a personal mentor for students.
Always reply in clear, simple English.
Be concise, helpful, and motivating.
Explain concepts step-by-step when needed.
`;

// 🧠 AI Call Handler
async function callAI(provider, message) {
  try {
    // ================= GROQ =================
    if (provider.type === "groq") {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${provider.key}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: message }
          ]
        })
      });

      const data = await res.json();

      if (data?.choices?.length > 0) {
        return {
          success: true,
          reply: data.choices[0].message.content,
          provider: provider.name
        };
      }
    }

    // ================= OPENROUTER =================
    if (provider.type === "openrouter") {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${provider.key}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://climbup.vercel.app",
          "X-Title": "ClimbUP AI"
        },
        body: JSON.stringify({
          model: "openrouter/free",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: message }
          ]
        })
      });

      const data = await res.json();

      if (data?.choices?.length > 0) {
        return {
          success: true,
          reply: data.choices[0].message.content,
          provider: provider.name
        };
      }
    }

    return { success: false };

  } catch (error) {
    return { success: false, error: error.message };
  }
}

// 🚀 MAIN HANDLER
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({
      message: "Use POST request"
    });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    // 🔀 Shuffle providers (load balancing)
    const providers = shuffle([...PROVIDERS]);

    // 🔁 Try all providers
    for (let provider of providers) {
      const result = await callAI(provider, message);

      if (result.success) {
        return res.status(200).json({
          reply: result.reply,
          provider: result.provider
        });
      }
    }

    // 🚨 FINAL FALLBACK (ClimbUP UX)
    return res.status(200).json({
      reply:
        "⚠️ The server is currently busy. Please try again in a few seconds. Keep going—you are doing great! 🚀",
      provider: "fallback"
    });

  } catch (error) {
    return res.status(500).json({
      error: "Server error",
      details: error.message
    });
  }
}
