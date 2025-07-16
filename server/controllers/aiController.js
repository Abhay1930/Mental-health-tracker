const { generateResponse } = require("../services/aiService");

exports.sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Invalid message format" });
    }

    // Add basic content filtering
    if (containsSensitiveContent(message)) {
      return res.status(400).json({
        error:
          "I cannot process messages containing harmful or inappropriate content.",
      });
    }

    const response = await generateResponse(message);

    // Log the interaction for monitoring (you could store this in a database)
    console.log({
      userId: req.user.id,
      message,
      response,
      timestamp: new Date(),
    });

    res.json({
      message: response,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({
      error: "Failed to process message",
      message:
        "I'm having trouble processing your message right now. Please try again in a moment.",
    });
  }
};

exports.chatWithAgent = async (req, res) => {
  try {
    const { message } = req.body;
    const response = await generateResponse(message);

    res.json({
      message: response,
      timestamp: new Date(),
    });
  } catch (err) {
    console.error("AI Agent Error:", err);
    res.status(500).json({ error: "Failed to get AI response" });
  }
};

exports.getExerciseSuggestion = async (req, res) => {
  try {
    const { mood, energy, anxiety } = req.body;

    const prompt = `Based on: Mood ${mood}/10, Energy ${energy}/10, Anxiety ${anxiety}/10, suggest a brief mindfulness exercise.`;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a mindfulness coach. Suggest brief, practical exercises based on the user's current state.",
        },
        { role: "user", content: prompt },
      ],
      model: "gpt-3.5-turbo",
      max_tokens: 300,
      temperature: 0.6,
    });

    res.json({
      suggestion: completion.choices[0].message.content,
      timestamp: new Date(),
    });
  } catch (err) {
    console.error("Exercise Suggestion Error:", err);
    res.status(500).json({ error: "Failed to get exercise suggestion" });
  }
};

function containsSensitiveContent(message) {
  const sensitivePatterns = [
    /suicide/i,
    /kill\s*(my)?self/i,
    /harm\s*(my)?self/i,
    // Add more patterns as needed
  ];

  return sensitivePatterns.some((pattern) => pattern.test(message));
}
