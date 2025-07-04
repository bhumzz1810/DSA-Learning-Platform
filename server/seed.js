const mongoose = require("mongoose");
const Problem = require("./models/Problem"); // adjust path
const sampleProblems = require("./sampleProblems.json"); // your JSON file

mongoose
  .connect(
    "mongodb+srv://dsarena:dsarena2025@dsarena.azy9sbk.mongodb.net/dsa_platform?retryWrites=true&w=majority&appName=DSArena",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(async () => {
    await Problem.insertMany(sampleProblems);
    console.log("Inserted 20 problems!");
    mongoose.disconnect();
  });
