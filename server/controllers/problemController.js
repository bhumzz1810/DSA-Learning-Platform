const Problem = require("../models/Problem");

// Validation helper (basic example)
const validateProblemData = (data) => {
  if (
    !data.title ||
    typeof data.title !== "string" ||
    data.title.trim() === ""
  ) {
    return "Title is required and must be a non-empty string.";
  }
  if (
    !data.description ||
    typeof data.description !== "string" ||
    data.description.trim() === ""
  ) {
    return "Description is required and must be a non-empty string.";
  }
  if (!["Easy", "Medium", "Hard"].includes(data.difficulty)) {
    return "Difficulty must be one of Easy, Medium, or Hard.";
  }
  return null;
};

// Create a new problem
exports.createProblem = async (req, res) => {
  try {
    const validationError = validateProblemData(req.body);
    if (validationError)
      return res.status(400).json({ error: validationError });
    // ensure authorId is present
    if (!req.body.authorId) req.body.authorId = req.user?.id;
    const problem = new Problem(req.body);
    await problem.save();
    res.status(201).json(problem);
  } catch (err) {
    console.error("Create Problem error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all problems
exports.getAllProblems = async (req, res) => {
  try {
    const filter =
      req.query.archived === "true"
        ? { isArchived: true }
        : { isArchived: false };
    const problems = await Problem.find(filter).sort({ createdAt: -1 });
    res.status(200).json(problems);
  } catch (err) {
    console.error("Get all problems error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get single problem by ID
exports.getProblemById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid problem ID format" });
    }

    const problem = await Problem.findById(id);
    if (!problem) return res.status(404).json({ error: "Problem not found" });

    res.status(200).json(problem);
  } catch (err) {
    console.error("Get problem by ID error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Update a problem
exports.updateProblem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid problem ID format" });
    }

    const validationError = validateProblemData(req.body);
    if (validationError)
      return res.status(400).json({ error: validationError });

    const updated = await Problem.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ error: "Problem not found" });

    res.status(200).json(updated);
  } catch (err) {
    console.error("Update problem error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Soft delete a problem (archive)
exports.deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid problem ID format" });
    }

    const updated = await Problem.findByIdAndUpdate(
      id,
      { $set: { isArchived: true } },
      { new: true, runValidators: false } // ← skip validators for archive
    );
    if (!updated) return res.status(404).json({ error: "Problem not found" });

    res.status(200).json({ message: "Problem archived" });
  } catch (err) {
    console.error("Archive problem error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Restore archived problem
exports.restoreProblem = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid problem ID format" });
    }

    const updated = await Problem.findByIdAndUpdate(
      id,
      { $set: { isArchived: false } },
      { new: true, runValidators: false }
    );
    if (!updated) return res.status(404).json({ error: "Problem not found" });

    res.status(200).json({ message: "Problem restored" });
  } catch (err) {
    console.error("Restore problem error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
