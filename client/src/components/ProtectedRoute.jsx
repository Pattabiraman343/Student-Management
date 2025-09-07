import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, roles }) => {
  const { user, token } = useSelector((state) => state.auth);

  // 1️⃣ If not logged in → redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2️⃣ If roles are passed, check access
  if (roles && !roles.includes(user?.role)) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md max-w-lg text-center">
          <h2 className="text-xl font-bold mb-2">🚫 Access Denied</h2>
          <p className="mb-3">
            Sorry, your role <b>{user?.role || "Unknown"}</b> doesn’t have
            permission to view this page.
          </p>
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // 3️⃣ Otherwise allow
  return children;
};

export default ProtectedRoute;
