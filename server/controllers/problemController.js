// controllers/problemController.js
const Problem = require("../models/Problem");

// Create a new problem
exports.createProblem = async (req, res) => {
  try {
    const problem = new Problem(req.body);
    await problem.save();
    res.status(201).json(problem);
  } catch (err) {
    res.status(400).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
  }
};

// Get single problem by ID
exports.getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ error: "Problem not found" });
    res.status(200).json(problem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a problem
exports.updateProblem = async (req, res) => {
  try {
    const updated = await Problem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Problem not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a problem
exports.deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ error: "Problem not found" });

    problem.isArchived = true;
    await problem.save();

    res.status(200).json({ message: "Problem archived" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.restoreProblem = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ error: "Problem not found" });

    problem.isArchived = false;
    await problem.save();
    res.status(200).json({ message: "Problem restored" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
