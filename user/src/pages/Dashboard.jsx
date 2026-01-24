/* eslint-disable react-hooks/immutability */
 
import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0
  });

  const [recentTransactions, setRecentTransactions] = useState([]);

  // INITIAL LOAD
  useEffect(() => {
    fetchSummary();
    fetchRecentTransactions();
  }, []);

  // SUMMARY
  const fetchSummary = async () => {
    try {
      const res = await api.get("/transactions/summary/balance");
      setSummary(res.data);
    } catch {
      console.error("Failed to load summary");
    }
  };

  // RECENT TRANSACTIONS (LAST 5 ONLY)
  const fetchRecentTransactions = async () => {
    try {
      const res = await api.get("/transactions");
      setRecentTransactions(res.data.slice(0, 5));
    } catch {
      console.error("Failed to load recent transactions");
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      await api.delete(`/transactions/${id}`);
      fetchRecentTransactions();
      fetchSummary();
    } catch {
      alert("Failed to delete transaction");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Dashboard</h3>

      {/* SUMMARY CARDS */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h6>Total Balance</h6>
              <h4>₹ {summary.balance}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-center shadow-sm">
            <div className="card-body text-success">
              <h6>Income</h6>
              <h4>₹ {summary.income}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-center shadow-sm">
            <div className="card-body text-danger">
              <h6>Expense</h6>
              <h4>₹ {summary.expense}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* RECENT TRANSACTIONS */}
      <div className="card shadow-sm mb-4">
        <div className="card-header">
          <strong>Recent Transactions</strong>
        </div>

        <div className="table-responsive">
          <table className="table mb-0">
            <thead>
              <tr>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {recentTransactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    No transactions found
                  </td>
                </tr>
              ) : (
                recentTransactions.map((t) => (
                  <tr key={t._id}>
                    <td>{t.description || "-"}</td>
                    <td>{t.category || "-"}</td>
                    <td
                      className={
                        t.type === "income"
                          ? "text-success"
                          : "text-danger"
                      }
                    >
                      ₹ {t.amount}
                    </td>
                    <td>
                      {new Date(t.date).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(t._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;