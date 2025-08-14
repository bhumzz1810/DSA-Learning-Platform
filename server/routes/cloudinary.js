// server/routes/cloudinary.js
const express = require("express");
const router = express.Router();
const cloudinary = require("../cloudinary");
const { authenticate } = require("../middleware/auth");

// GET /api/cloudinary/sign  -> returns params for a signed client-side upload
router.get("/sign", authenticate, async (req, res) => {
  try {
    const timestamp = Math.round(Date.now() / 1000);

    // keep a stable public_id per user so re-uploads overwrite the old image
    const public_id = `users/${req.user.id}`;

    const paramsToSign = {
      timestamp,
      folder: "user-photos",
      public_id,
      overwrite: true,
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({
      timestamp,
      signature,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      folder: "user-photos",
      public_id,
      overwrite: true,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to sign Cloudinary request" });
  }
});

// DELETE /api/cloudinary/delete -> delete by public_id
router.delete("/delete", authenticate, async (req, res) => {
  try {
    const { publicId } = req.body;
    if (!publicId) return res.status(400).json({ message: "publicId required" });
    const result = await cloudinary.uploader.destroy(publicId);
    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to delete image" });
  }
});

module.exports = router;
