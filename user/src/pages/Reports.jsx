/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import api from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis
} from "recharts";

const COLORS = ["#0d6efd", "#198754", "#dc3545", "#ffc107", "#6f42c1"];

function Reports() {
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // chart filters
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  // history filters
  const [filters, setFilters] = useState({
    type: "",
    category: "",
    startDate: "",
    endDate: ""
  });

  /* ---------------- CHART DATA ---------------- */

  const loadCategory = async () => {
    try {
      const params = {};
      if (selectedCategory) params.category = selectedCategory;

      const res = await api.get(
        "/transactions/summary/category",
        { params }
      );

      setCategoryData(
        res.data.map(item => ({
          name: item._id || "Other",
          value: item.total
        }))
      );
    } catch {
      setCategoryData([]);
    }
  };

  const loadMonthly = async () => {
    try {
      const params = {};
      if (selectedMonth) {
        const [year, month] = selectedMonth.split("-");
        params.startDate = `${year}-${month}-01`;
        params.endDate = `${year}-${month}-31`;
      }

      const res = await api.get(
        "/transactions/summary/monthly",
        { params }
      );

      const map = {};
      res.data.forEach(i => {
        const key = `${i._id.month}/${i._id.year}`;
        if (!map[key]) {
          map[key] = { month: key, income: 0, expense: 0 };
        }
        map[key][i._id.type] = i.total;
      });

      setMonthlyData(Object.values(map));
    } catch {
      setMonthlyData([]);
    }
  };

  /* ---------------- TRANSACTION HISTORY ---------------- */

  const loadTransactions = async () => {
    try {
      const res = await api.get("/transactions", {
        params: filters
      });
      setTransactions(res.data);
    } catch {
      setTransactions([]);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  /* ---------------- EFFECTS ---------------- */

  useEffect(() => {
    loadCategory();
    loadMonthly();
  }, [selectedCategory, selectedMonth]);

  useEffect(() => {
    loadTransactions();
  }, [filters]);

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Reports</h3>

      {/* CHART FILTERS */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Filter chart by category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <input
            type="month"
            className="form-control"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
        </div>
      </div>

      {/* CHARTS */}
      <div className="row g-4 mb-5">
        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h6 className="text-center mb-3">Expenses by Category</h6>

            {categoryData.length === 0 ? (
              <p className="text-center">No data</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {categoryData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={COLORS[i % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-3 shadow-sm">
            <h6 className="text-center mb-3">
              Monthly Income vs Expense
            </h6>

            {monthlyData.length === 0 ? (
              <p className="text-center">No data</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="income" fill="#198754" />
                  <Bar dataKey="expense" fill="#dc3545" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* TRANSACTION HISTORY WITH FILTERS */}
      <div className="card shadow-sm">
        <div className="card-header">
          <strong>Transaction History</strong>
        </div>

        <div className="card-body">
          {/* FILTERS */}
          <div className="row g-3 mb-3">
            <div className="col-md-3">
              <select
                className="form-select"
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div className="col-md-3">
              <input
                type="text"
                name="category"
                className="form-control"
                placeholder="Category"
                value={filters.category}
                onChange={handleFilterChange}
              />
            </div>

            <div className="col-md-3">
              <input
                type="date"
                name="startDate"
                className="form-control"
                value={filters.startDate}
                onChange={handleFilterChange}
              />
            </div>

            <div className="col-md-3">
              <input
                type="date"
                name="endDate"
                className="form-control"
                value={filters.endDate}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          {/* HISTORY TABLE */}
          <div className="table-responsive">
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  transactions.map((t) => (
                    <tr key={t._id}>
                      <td>{t.description || "-"}</td>
                      <td>{t.category || "-"}</td>
                      <td>{t.type}</td>
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
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
