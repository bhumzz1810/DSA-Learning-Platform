const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const axios = require("axios");

const JUDGE0_API = "https://judge0-ce.p.rapidapi.com/submissions";
const JUDGE0_HEADERS = {
  "content-type": "application/json",
  "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
  "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
};

// Helper: Sleep function for polling delay
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

router.post("/execute", authenticate, async (req, res) => {
  const { source_code, language_id, stdin } = req.body;

  // Basic validation
  if (
    typeof source_code !== "string" ||
    typeof language_id !== "number" ||
    (stdin && typeof stdin !== "string")
  ) {
    return res.status(400).json({ error: "Invalid input parameters" });
  }

  try {
    // Submit the code to Judge0
    const submitResponse = await axios.post(
      JUDGE0_API,
      {
        source_code,
        language_id,
        stdin: stdin || "",
        // optional: add 'expected_output' if you want to verify output
      },
      { headers: JUDGE0_HEADERS }
    );

    const token = submitResponse.data.token;
    if (!token) {
      return res.status(500).json({ error: "Failed to receive token from Judge0" });
    }

    let result = null;
    let attempts = 0;
    const maxAttempts = 20; // max wait ~20 seconds

    // Poll Judge0 for the result (status.id > 2 means finished)
    while ((!result || result.status.id <= 2) && attempts < maxAttempts) {
      const statusResponse = await axios.get(`${JUDGE0_API}/${token}?base64_encoded=false`, {
        headers: JUDGE0_HEADERS,
      });
      result = statusResponse.data;

      if (result.status.id > 2) break;

      attempts++;
      await sleep(1000);
    }

    if (!result || result.status.id <= 2) {
      // Timeout or incomplete execution
      return res.status(504).json({ error: "Execution timeout, please try again." });
    }

    // Remove any sensitive info if needed before sending to client
    delete result.token;

    res.json(result);
  } catch (err) {
    console.error(
      "❌ Judge0 Error:",
      err?.response?.data || err.message || err
    );
    res.status(500).json({
      error: "Execution failed",
      details: err?.response?.data || err.message,
    });
  }
});

module.exports = router;
