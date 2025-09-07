import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import "./Navbar.css";

const Navbar = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scroll, setScroll] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // Navbar shadow on scroll
  useEffect(() => {
    const handleScroll = () => setScroll(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scroll ? "navbar-shadow" : ""}`}>
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">StudentMS</Link>
        </div>

        {/* Hamburger */}
        <div
          className={`hamburger ${isOpen ? "open" : ""}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Links */}
        <div className={`navbar-links ${isOpen ? "active" : ""}`}>
          {!token ? (
            <>
              <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setIsOpen(false)}>Register</Link>
            </>
          ) : (
            <>

{user?.role === "Admin" && (
  <Link to="/audit-logs" className="nav-link">
    Audit Logs
  </Link>
)}

              <Link to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
              <Link to="/students" onClick={() => setIsOpen(false)}>Students</Link>
              {/* {user?.role === "Admin" && (
                <Link to="/add-student" onClick={() => setIsOpen(false)}>Add Student</Link>
              )} */}
              <button
                onClick={() => { handleLogout(); setIsOpen(false); }}
                className="logout-btn"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
