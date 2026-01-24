import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AddTransaction() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    amount: "",
    type: "expense",
    category: "",
    date: "",
    description: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.post("/transactions", {
        ...form,
        amount: Number(form.amount)
      });
      setSuccess("Transaction added successfully");
      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add transaction");
    }
  };

  return (
    <div className="container mt-4">
      <div className="col-md-6 mx-auto border rounded p-4 shadow-sm">
        <h3 className="mb-4 text-center">Add Transaction</h3>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Amount</label>
            <input
              type="number"
              className="form-control"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Type</label>
            <select
              className="form-select"
              name="type"
              value={form.type}
              onChange={handleChange}
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Category</label>
            <input
              type="text"
              className="form-control"
              name="category"
              value={form.category}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <input
              type="text"
              className="form-control"
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <button className="btn btn-dark w-100">Add</button>
        </form>
      </div>
    </div>
  );
}

export default AddTransaction;
