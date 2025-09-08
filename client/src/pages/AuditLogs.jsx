// src/components/AuditLogs.js
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getAuditLogs } from "../api/students";
import "./AuditLogs.css";

const AuditLogs = () => {
  const role = useSelector((state) => state.auth.user?.role);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["auditLogs"],
    queryFn: getAuditLogs,
    enabled: role === "Admin", 
  });

  if (role !== "Admin")
    return <p className="access-denied">🚫 Access Denied!</p>;

  if (isLoading) return <p>Loading logs...</p>;
  if (isError || !data) return <p>No logs available.</p>;

  return (
    <div className="audit-container">
      <h2> Audit Logs</h2>
      <table className="audit-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Action</th>
            <th>Student</th>
            <th>Changes</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {data.map((log) => (
            <tr key={log.id}>
              <td>{log.user?.username || "Unknown"}</td>
              <td>{log.user?.role || "-"}</td>
              <td>{log.action}</td>
              <td>{log.student?.name || "-"}</td>
              <td>
                <details>
                  <summary>View</summary>
                  <pre>{JSON.stringify(log.changes, null, 2)}</pre>
                </details>
              </td>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLogs;
