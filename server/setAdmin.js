// scripts/setAdmin.js
const mongoose = require("mongoose");
const User = require("./models/User"); // Adjust the path if needed

const MONGO_URI =
  "mongodb+srv://dsarena:dsarena2025@dsarena.azy9sbk.mongodb.net/dsa_platform?retryWrites=true&w=majority&appName=DSArena";

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    const email = "admin@dsarena.com";

    const user = await User.findOne({ email });
    if (user) {
      user.role = "admin";
      await user.save();
      console.log(`✅ ${email} is now an admin!`);
    } else {
      console.log(`❌ No user found with email: ${email}`);
    }
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  })
  .finally(() => {
    mongoose.disconnect();
  });
