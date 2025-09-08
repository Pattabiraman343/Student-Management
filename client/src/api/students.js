import axios from "axios";

// Hardcoded Render backend URLs
const API_URL = "https://student-management-lc6d.onrender.com/api/students";
const API_BASE = "https://student-management-lc6d.onrender.com/api";

// Get auth headers
const getAuthHeaders = (isFormData = false) => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
  };
};

// ✅ Create Student (supports FormData)
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

// ✅ Get all students
export const getStudents = async ({ page = 1, limit = 10, search = "", gradeFilter = "", sectionFilter = "" }) => {
  try {
    const params = { page, limit };
    if (search) params.search = search;
    if (gradeFilter) params.gradeFilter = gradeFilter;
    if (sectionFilter) params.sectionFilter = sectionFilter;

    const res = await axios.get(API_URL, { headers: getAuthHeaders(), params });
    return res.data; // { students: [], totalPages, total }
  } catch (err) {
    console.error("Error fetching students:", err.response?.data || err.message);
    throw err;
  }
};

// ✅ Get student by ID
export const getStudentById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/${id}`, { headers: getAuthHeaders() });
    return res.data;
  } catch (err) {
    console.error("Error fetching student:", err.response?.data || err.message);
    throw err;
  }
};

// ✅ Update Student
export const updateStudent = async (id, studentData) => {
  try {
    const isFormData = studentData instanceof FormData;
    const res = await axios.put(`${API_URL}/${id}`, studentData, { headers: getAuthHeaders(isFormData) });
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

// ✅ Get all grades
export const getAllGrades = async () => {
  try {
    const res = await axios.get(`${API_BASE}/students/classes`, { headers: getAuthHeaders() });
    return res.data.grades || [];
  } catch (err) {
    console.error("Error fetching grades:", err.response?.data || err.message);
    return [];
  }
};

// ✅ Get all sections
export const getAllSections = async () => {
  try {
    const res = await axios.get(`${API_BASE}/students/classes`, { headers: getAuthHeaders() });
    return res.data.sections || [];
  } catch (err) {
    console.error("Error fetching sections:", err.response?.data || err.message);
    return [];
  }
};

// ✅ Get all classes
export const getAllClasses = async () => {
  try {
    const res = await axios.get(`${API_BASE}/students/classes`, { headers: getAuthHeaders() });
    return res.data.classes || [];
  } catch (err) {
    console.error("Error fetching classes:", err.response?.data || err.message);
    return [];
  }
};

// ✅ Export students as Excel
export const exportStudents = async () => {
  try {
    const res = await axios.get(`${API_URL}/export`, { headers: getAuthHeaders(), responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "students.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error("Error exporting students:", err.response?.data || err.message);
    throw err;
  }
};

// ✅ Import students from Excel
export const importStudents = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axios.post(`${API_URL}/import`, formData, { headers: getAuthHeaders(true) });
    return res.data; // { inserted, skipped, errors }
  } catch (err) {
    console.error("Error importing students:", err.response?.data || err.message);
    throw err;
  }
};

// ✅ Get audit logs
export const getAuditLogs = async () => {
  try {
    const res = await axios.get(`${API_BASE}/audit-logs`, { headers: getAuthHeaders() });
    return res.data;
  } catch (err) {
    console.error("Error fetching audit logs:", err.response?.data || err.message);
    throw err;
  }
};
