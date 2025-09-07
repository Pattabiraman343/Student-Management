import React from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./Dashboard.css";

export default function Dashboard() {
  const role = useSelector((state) => state.auth.user?.role);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await api.get("/students/dashboard");
      console.log("Dashboard API data:", res.data);
      return res.data;
    },
    enabled: role === "Admin",
  });

  if (role !== "Admin") return <p className="access-denied">🚫 Access Denied! Admins only.</p>;
  if (isLoading) return <p className="loading">Loading...</p>;
  if (isError || !data) return <p className="error-text">No dashboard data</p>;

  // Use backend keys safely
  const perClassData = data.perGrade || []; // perGrade from backend
  const genderData = data.genderRatio || [];

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">📊 Student Dashboard</h1>

      {/* Summary Cards */}
      <div className="cards-container">
        <div className="card">
          <h3>Total Students</h3>
          <p>{data.total}</p>
        </div>
        <div className="card">
          <h3>Male Students</h3>
          <p>{genderData.find((g) => g.gender === "Male")?.count || 0}</p>
        </div>
        <div className="card">
          <h3>Female Students</h3>
          <p>{genderData.find((g) => g.gender === "Female")?.count || 0}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-container">
        <div className="chart-box">
          <h4>Students per Class</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={perClassData}>
              <XAxis dataKey="grade" /> {/* grade from backend */}
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h4>Gender Ratio</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genderData}
                dataKey="count"
                nameKey="gender"
                outerRadius="80%"
                label
              >
                {genderData.map((entry, index) => (
                  <Cell key={index} fill={index % 2 === 0 ? "#16a34a" : "#2563eb"} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
