const express = require("express");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();
router.post("/", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo", // or use gpt-4 if available
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

    const suggestion = response.data.choices[0].message.content;
    res.json({ suggestion });
  } catch (error) {
    console.error("AI Suggestion Error:", error.response?.data || error);
    res.status(500).json({ error: "Failed to fetch suggestion" });
  }
});

module.exports = router;
