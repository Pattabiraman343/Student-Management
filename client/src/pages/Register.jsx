import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import "./Auth.css";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const navigate = useNavigate();
  const [showSpinner, setShowSpinner] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/auth/register", data);
      return res.data;
    },
    onSuccess: () => {
      // Show spinner overlay for 2 seconds before navigating
      setShowSpinner(true);
      setTimeout(() => {
        reset();
        navigate("/login");
      }, 2000);
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="auth-container">
      {(mutation.isLoading || showSpinner) && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
          <p className="spinner-text">Registering...</p>
        </div>
      )}

      <div className="auth-card">
        <h2 className="auth-title">Register</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="form-group">
            <label>Username</label>
            <input
              {...register("username", { required: "Username is required" })}
              placeholder="Enter username"
            />
            {errors.username && (
              <p className="error-text">{errors.username.message}</p>
            )}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              placeholder="Enter password"
            />
            {errors.password && (
              <p className="error-text">{errors.password.message}</p>
            )}
          </div>

          <div className="form-group">
            <label>Role</label>
            <select {...register("role", { required: "Role is required" })}>
              <option value="">-- Select Role --</option>
              <option value="Admin">Admin</option>
              <option value="Teacher">Teacher</option>
            </select>
            {errors.role && <p className="error-text">{errors.role.message}</p>}
          </div>

          <button
            type="submit"
            disabled={mutation.isLoading || showSpinner}
            className="btn"
          >
            Register
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
