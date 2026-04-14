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

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528:free", // 🔥 free model
        messages: [
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    if (data?.choices?.length > 0) {
      return res.status(200).json({
        reply: data.choices[0].message.content
      });
    } else {
      return res.status(200).json({
        error: "No response from OpenRouter",
        fullResponse: data
      });
    }

  } catch (error) {
    return res.status(500).json({
      error: "Server error",
      details: error.message
    });
  }
}
