import axios from "axios";

const API_URL = "http://localhost:5000/api/students";
const API_URP = "http://localhost:5000/api";  // backend base URL

// Get token from localStorage
const getAuthHeaders = (isFormData = false) => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    ...(isFormData ? {} : { "Content-Type": "application/json" }), 
    // If sending FormData, let browser handle Content-Type
  };
};

// ✅ Create Student (with image)
export const createStudent = async (studentData) => {
  try {
    const isFormData = studentData instanceof FormData;
    const res = await axios.post(API_URL, studentData, {
      headers: getAuthHeaders(isFormData),
    });
    return res.data;
  } catch (err) {
    console.error("Error creating student:", err.response?.data || err.message);
    throw err;
  }
};
export const getAuditLogs = async () => {
    const res = await axios.get(`${API_URP}/audit-logs`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // if using auth
      },
    });
    return res.data;
  };
export const getStudents = async ({ page = 1, limit = 10, search = "", gradeFilter = "", sectionFilter = "" }) => {
    const params = { page, limit };
    if (search) params.search = search;
    if (gradeFilter) params.gradeFilter = gradeFilter;
    if (sectionFilter) params.sectionFilter = sectionFilter;
  
    const res = await axios.get(API_URL, {
      headers: getAuthHeaders(),
      params,
    });
  
    return res.data; // should contain { students: [], totalPages, total }
  };
  
// api/students.js
export const getAllSections = async () => {
  const res = await axios.get("http://localhost:5000/api/students/classes", {
    headers: getAuthHeaders(),
  });
  return res.data.sections || [];
};
export const getAllGrades = async () => {
  const res = await axios.get("http://localhost:5000/api/students/classes", {
    headers: getAuthHeaders(),
  });
  return res.data.grades || []; // return grades array
};

// ✅ Get Student by ID
export const getStudentById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/${id}`, { headers: getAuthHeaders() });
    return res.data;
  } catch (err) {
    console.error("Error fetching student:", err.response?.data || err.message);
    throw err;
  }
};

// ✅ Update Student (works with FormData or JSON)
export const updateStudent = async (id, studentData) => {
  try {
    const isFormData = studentData instanceof FormData;
    const res = await axios.put(`${API_URL}/${id}`, studentData, {
      headers: getAuthHeaders(isFormData),
    });
    return res.data;
  } catch (err) {
    console.error("Error updating student:", err.response?.data || err.message);
    throw err;
  }
};

// ✅ Delete Student
export const deleteStudent = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeaders() });
    return res.data;
  } catch (err) {
    console.error("Error deleting student:", err.response?.data || err.message);
    throw err;
  }
};
export const getAllClasses = async (token) => {
    try {
      const res = await axios.get("http://localhost:5000/api/students/classes", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return res.data.classes || [];
    } catch (err) {
      console.error("Error fetching classes:", err.response?.data || err.message);
      return [];
    }
  };
  
  export const exportStudents = async () => {
    try {
      const res = await axios.get(`${API_URL}/export`, {
        headers: getAuthHeaders(),
        responseType: "blob",
      });
  
      // Trigger file download
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "students.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error exporting:", err.response?.data || err.message);
      throw err;
    }
  };
  
  export const importStudents = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
  
      const res = await axios.post(`${API_URL}/import`, formData, {
        headers: getAuthHeaders(true),
      });
  
      return res.data; // ✅ Will contain inserted, skipped, errors
    } catch (err) {
      console.error("Error importing:", err.response?.data || err.message);
      throw err;
    }
  };