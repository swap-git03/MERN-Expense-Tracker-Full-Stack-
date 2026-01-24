const Transaction = require("../models/Transaction");

// ADD
exports.addTransaction = async (req, res) => {
  try {
    const { amount, type, category, description, date } = req.body;

    if (!amount || !type) {
      return res.status(400).json({ message: "Amount and type are required" });
    }

    const transaction = await Transaction.create({
      amount,
      type,
      category,
      description,
      date,
      user: req.user._id
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Failed to add transaction" });
  }
};

// GET ALL with SEARCH & FILTER
exports.getTransactions = async (req, res) => {
  try {
    const { type, category, startDate, endDate, search } = req.query;

    const query = { user: req.user._id };

    if (type) query.type = type;
    if (category) query.category = category;

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (search) {
      query.description = { $regex: search, $options: "i" };
    }

    const transactions = await Transaction.find(query).sort({ date: -1 });

    res.status(200).json(transactions);
  } catch {
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
};


// GET BY ID
exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json(transaction);
  } catch {
    res.status(500).json({ message: "Failed to fetch transaction" });
  }
};

// UPDATE
exports.updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json(transaction);
  } catch {
    res.status(500).json({ message: "Failed to update transaction" });
  }
};

// DELETE
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted" });
  } catch {
    res.status(500).json({ message: "Failed to delete transaction" });
  }
};

// TOTAL BALANCE
exports.getBalance = async (req, res) => {
  try {
    const result = await Transaction.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" }
        }
      }
    ]);

    let income = 0;
    let expense = 0;

    result.forEach(item => {
      if (item._id === "income") income = item.total;
      if (item._id === "expense") expense = item.total;
    });

    res.status(200).json({
      income,
      expense,
      balance: income - expense
    });
  } catch {
    res.status(500).json({ message: "Failed to calculate balance" });
  }
};

// EXPENSES BY CATEGORY
exports.getExpenseByCategory = async (req, res) => {
  try {
    const data = await Transaction.aggregate([
      { $match: { user: req.user._id, type: "expense" } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" }
        }
      }
    ]);

    res.status(200).json(data);
  } catch {
    res.status(500).json({ message: "Failed to get category summary" });
  }
};

// MONTHLY INCOME VS EXPENSE
exports.getMonthlySummary = async (req, res) => {
  try {
    const data = await Transaction.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            year: { $year: "$date" },
            type: "$type"
          },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    res.status(200).json(data);
  } catch {
    res.status(500).json({ message: "Failed to get monthly summary" });
  }
};
