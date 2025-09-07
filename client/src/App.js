import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/StudentsList";
import AddStudent from "./pages/AddStudent";
import Class from "./pages/ClassPage";
import AuditLogs from "./pages/AuditLogs";

import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home"; // ✅ Import new Home page

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />   {/* 👈 Default Home Page */}

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
                <Route
          path="/Class"
          element={
            <ProtectedRoute>
              <Class />
            </ProtectedRoute>
          }
        />
<Route path="/audit-logs" element={<AuditLogs />} />


        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <Students />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-student"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <AddStudent />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
