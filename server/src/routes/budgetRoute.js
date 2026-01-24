const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const controller = require("../controllers/budgetController");

router.post("/", auth, controller.setBudget);
router.get("/", auth, controller.getBudgets);

module.exports = router;
