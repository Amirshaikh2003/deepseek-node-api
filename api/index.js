export default async function handler(req, res) {
  try {
    const { message } = req.body;

    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    return res.status(200).json({
      fullResponse: data   // 👈 IMPORTANT
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
