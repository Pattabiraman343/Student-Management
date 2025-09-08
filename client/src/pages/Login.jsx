import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { loginSuccess } from "../redux/authSlice";
import "./Auth.css";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showSpinner, setShowSpinner] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/auth/login", data);
      return res.data;
    },
    onSuccess: (data) => {
      dispatch(loginSuccess({ user: { role: data.role }, token: data.token }));

      // Show spinner overlay for 2 seconds
      setShowSpinner(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="auth-container">
      { (mutation.isLoading || showSpinner) && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}

      <div className="auth-card">
        <h2 className="auth-title">Login</h2>

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

          <button
            type="submit"
            disabled={mutation.isLoading || showSpinner}
            className="btn"
          >
            Login
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link to="/register" className="auth-link">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
