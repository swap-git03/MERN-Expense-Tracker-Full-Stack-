const Budget = require("../models/Budget");

// SET or UPDATE budget
exports.setBudget = async (req, res) => {
  try {
    const { category, limit } = req.body;

    if (!category || !limit) {
      return res.status(400).json({ message: "Category and limit are required" });
    }

    const budget = await Budget.findOneAndUpdate(
      { user: req.user._id, category },
      { limit },
      { upsert: true, new: true }
    );

    res.status(200).json(budget);
  } catch {
    res.status(500).json({ message: "Failed to set budget" });
  }
};

// GET all budgets
exports.getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id });
    res.status(200).json(budgets);
  } catch {
    res.status(500).json({ message: "Failed to fetch budgets" });
  }
};
