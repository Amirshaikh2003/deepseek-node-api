export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({
      message: "Use POST request"
    });
  }

  const { message } = req.body;

  try {
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "sk-8b72a711a79a4f5f8f98000a6aec9c9e"
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    const reply = data.choices[0].message.content;

    res.status(200).json({ reply });

  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
}
