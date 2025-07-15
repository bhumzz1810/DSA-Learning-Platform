const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const axios = require("axios");
const JUDGE0_API = "https://judge0-ce.p.rapidapi.com/submissions";
const JUDGE0_HEADERS = {
  "content-type": "application/json",
  "Content-Type": "application/json",
  "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
  "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
};
router.post("/execute", authenticate, async (req, res) => {
  const { source_code, language_id, stdin } = req.body;

  try {
    const submit = await axios.post(
      JUDGE0_API,
      {
        source_code,
        language_id,
        stdin,
      },
      { headers: JUDGE0_HEADERS }
    );

    const token = submit.data.token;
    let result = null;

    // Poll until complete
    while (!result || result.status.id <= 2) {
      const resStatus = await axios.get(
        `${JUDGE0_API}/${token}?base64_encoded=false`,
        {
          headers: JUDGE0_HEADERS,
        }
      );
      result = resStatus.data;
      if (result.status.id > 2) break;
      await new Promise((r) => setTimeout(r, 1000));
    }

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
