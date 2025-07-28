const express = require("express");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();
const { authenticate } = require("../middleware/auth");
const checkSubscription = require("../middleware/checkSubscription");

router.post("/", authenticate, checkSubscription, async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
    return res.status(400).json({ error: "Prompt is required and must be a non-empty string" });
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo", // or gpt-4 if available
        messages: [
          {
            role: "system",
            content: "You are a helpful JavaScript coding assistant.",
          },
          { role: "user", content: `Continue this code:\n${prompt}` },
        ],
        temperature: 0.2,
        max_tokens: 100,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const suggestion = response.data.choices?.[0]?.message?.content;

    if (!suggestion) {
      return res.status(500).json({ error: "No suggestion received from AI" });
    }

    res.json({ suggestion });
  } catch (error) {
    console.error("AI Suggestion Error:", error.response?.data || error.message || error);
    res.status(500).json({ error: "Failed to fetch suggestion" });
  }
});

module.exports = router;
