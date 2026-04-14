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

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // ✅ WORKING MODEL
        messages: [
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    // 🔍 Debug (optional)
    // console.log(data);

    if (data?.choices?.length > 0) {
      return res.status(200).json({
        reply: data.choices[0].message.content
      });
    } else {
      return res.status(200).json({
        error: "No response from Groq",
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
