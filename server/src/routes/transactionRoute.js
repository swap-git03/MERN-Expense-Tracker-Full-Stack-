const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const controller = require("../controllers/transactionController");

router.post("/", auth, controller.addTransaction);
router.get("/", auth, controller.getTransactions);
router.get("/summary/balance", auth, controller.getBalance);
router.get("/summary/category", auth, controller.getExpenseByCategory);
router.get("/summary/monthly", auth, controller.getMonthlySummary);

router.get("/:id", auth, controller.getTransactionById);
router.put("/:id", auth, controller.updateTransaction);
router.delete("/:id", auth, controller.deleteTransaction);

module.exports = router;
