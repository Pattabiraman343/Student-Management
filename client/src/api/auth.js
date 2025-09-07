import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// ✅ Register User
export const registerUser = async (userData) => {
  try {
    const res = await axios.post(`${API_URL}/register`, userData, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  } catch (err) {
    console.error("Error registering user:", err.response?.data || err.message);
    throw err;
  }
};

// ✅ Login User
export const loginUser = async (credentials) => {
  try {
    const res = await axios.post(`${API_URL}/login`, credentials, {
      headers: { "Content-Type": "application/json" },
    });

    // store token in localStorage
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }

    return res.data;
  } catch (err) {
    console.error("Error logging in:", err.response?.data || err.message);
    throw err;
  }
};

// ✅ Get Logged In User (from token)
export const getProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching profile:", err.response?.data || err.message);
    throw err;
  }
};

// ✅ Logout User
export const logoutUser = () => {
  localStorage.removeItem("token");
};
