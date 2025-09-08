import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  getStudents,
  deleteStudent,
  updateStudent,
  exportStudents,
  importStudents,
  getAllSections,
  getAllGrades,
} from "../api/students";
import "./StudentsList.css";
import heroImage2 from "../assets/blank-profile-picture-973460_1280.webp"; // Add your hero image here


const StudentsList = () => {
  const { user } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const RENDER_BASE_URL = "https://student-management-lc6d.onrender.com";
  const [spinnerText, setSpinnerText] = useState(""); // For dynamic spinner text

  // Fetch students
  const { data, isLoading, isError } = useQuery({
    queryKey: ["students", page, search, gradeFilter, sectionFilter],
    queryFn: () =>
      getStudents({ page, limit: 10, search, gradeFilter, sectionFilter }),
    keepPreviousData: true,
  });

  // Fetch sections and grades for dropdowns
  const { data: sectionsData = [] } = useQuery({
    queryKey: ["sections"],
    queryFn: getAllSections,
  });

  const { data: gradesData = [] } = useQuery({
    queryKey: ["grades"],
    queryFn: getAllGrades,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteStudent,
    onMutate: () => setSpinnerText("Deleting student..."),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setShowDeleteModal(false);
      setStudentToDelete(null);
      setSpinnerText(""); // hide spinner
    },
    onError: () => setSpinnerText(""), // hide spinner on error
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, formData }) => updateStudent(id, formData),
    onMutate: () => setSpinnerText("Updating student..."),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setEditingStudent(null);
      setPreview(null);
      setSpinnerText(""); // hide spinner
    },
    onError: () => setSpinnerText(""),
  });

  const students = data?.students || [];
  const totalPages = data?.totalPages || 1;

  const handleEditClick = (student) => {
    setEditingStudent(student);
    setPreview(
      student.image ? `${RENDER_BASE_URL}/uploads/${student.image}` : null
    );
  };

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  };

  const handleDelete = (id) => deleteMutation.mutate(id);

  const handleUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", editingStudent.name);
    formData.append("age", editingStudent.age);
    formData.append("grade", editingStudent.grade);
    formData.append("section", editingStudent.section);
    formData.append("gender", editingStudent.gender);
    if (editingStudent.imageFile) formData.append("image", editingStudent.imageFile);

    updateMutation.mutate({ id: editingStudent.id, formData });
  };

  return (
    <div className="students-container">
            {(deleteMutation.isLoading || updateMutation.isLoading) && spinnerText && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
          <p className="spinner-text">{spinnerText}</p>
        </div>
      )}
      <h2 className="students-title">Students List</h2>

      {/* Filters */}
      <div className="filters-container">
        <div className="filters">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          {/* Grade Filter */}
          <div className="filter-wrapper">
  <div className="dropdown-wrapper">
    <select
      className="filter-dropdown"
      value={gradeFilter}
      onChange={(e) => {
        setGradeFilter(e.target.value);
        setPage(1);
      }}
    >
      <option value="">All Classes</option>
      {gradesData.map((g) => (
        <option key={g} value={g}>
          {g}
        </option>
      ))}
    </select>
  </div>

  <div className="dropdown-wrapper">
    <select
      className="filter-dropdown"
      value={sectionFilter}
      onChange={(e) => {
        setSectionFilter(e.target.value);
        setPage(1);
      }}
    >
      <option value="">All Sections</option>
      {sectionsData.map((sec) => (
        <option key={sec} value={sec}>
          {sec}
        </option>
      ))}
    </select>
  </div>
</div>



          {user?.role === "Admin" && (
            <>
              <button className="export-btn" onClick={() => exportStudents()}>
                Export to Excel
              </button>
              <input
                type="file"
                accept=".xlsx"
                style={{ display: "none" }}
                id="import-file"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    try {
                      const result = await importStudents(file);
                      alert(
                        `✅ ${result.msg} (${result.inserted} imported, ${result.skipped} skipped)`
                      );
                      queryClient.invalidateQueries({ queryKey: ["students"] });
                    } catch {
                      alert("❌ Import failed. Check console for details.");
                    }
                  }
                }}
              />
              <label htmlFor="import-file" className="import-btn">
                Import Excel
              </label>
            </>
          )}

          <button
            className="clear-btn"
            onClick={() => {
              setSearch("");
              setGradeFilter("");
              setSectionFilter("");
              setPage(1);
            }}
          >
            Clear Filters
          </button>
        </div>

        {user?.role === "Admin" && (
          <button
            className="add-btn"
            onClick={() => (window.location.href = "/add-student")}
          >
            Add Student
          </button>
        )}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="loader">Loading...</div>
      ) : isError ? (
        <p className="text-center error-text">Error fetching students.</p>
      ) : students.length === 0 ? (
        <p className="text-center">No students found.</p>
      ) : (
        <>
          <table className="students-table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Age</th>
                <th>Grade</th>
                <th>Section</th>
                <th>Gender</th>
                {user?.role === "Admin" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
           <td>
  {s.image ? (
    <img
      src={`${RENDER_BASE_URL}/uploads/${s.image}`}
      alt={s.name}
      className="student-photo"
    />
  ) : (
    <img
      src={heroImage2}// <-- path to your default image
      alt="Default"
      className="student-photo default-photo"
    />
  )}
</td>

                  <td>{s.name}</td>
                  <td>{s.age}</td>
                  <td>{s.grade}</td>
                  <td>{s.section}</td>
                  <td>{s.gender}</td>
                  {user?.role === "Admin" && (
                    <td>
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleEditClick(s)}
                      >
                        Edit
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteClick(s)}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="page-btn"
            >
              ⬅ Prev
            </button>
            <p>
              Page {page} of {totalPages}
            </p>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className="page-btn"
            >
              Next ➡
            </button>
          </div>
        </>
      )}

      {/* Edit Modal */}
      {editingStudent && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Student</h3>
            <form onSubmit={handleUpdate}>
              <input
                type="text"
                value={editingStudent.name}
                onChange={(e) =>
                  setEditingStudent({ ...editingStudent, name: e.target.value })
                }
              />
              <input
                type="number"
                value={editingStudent.age}
                onChange={(e) =>
                  setEditingStudent({ ...editingStudent, age: e.target.value })
                }
              />

              <select
                value={editingStudent.grade}
                onChange={(e) =>
                  setEditingStudent({ ...editingStudent, grade: e.target.value })
                }
              >
                <option value="">-- Select Grade --</option>
                {gradesData.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>

              <select
                value={editingStudent.section}
                onChange={(e) =>
                  setEditingStudent({ ...editingStudent, section: e.target.value })
                }
              >
                <option value="">-- Select Section --</option>
                {sectionsData.map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>

              <select
                value={editingStudent.gender}
                onChange={(e) =>
                  setEditingStudent({ ...editingStudent, gender: e.target.value })
                }
              >
                <option value="">-- Select Gender --</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files[0]) {
                    setEditingStudent({
                      ...editingStudent,
                      imageFile: e.target.files[0],
                    });
                    setPreview(URL.createObjectURL(e.target.files[0]));
                  }
                }}
              />

              {preview && <img src={preview} alt="Preview" className="preview-img" />}

              <div className="modal-actions">
                <button type="submit" className="save-btn">
                  Update
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setEditingStudent(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && studentToDelete && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <h3>Confirm Delete</h3>
            <p>
              Are you sure you want to delete <strong>{studentToDelete.name}</strong>?
            </p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button
                className="confirm-delete-btn"
                onClick={() => handleDelete(studentToDelete.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsList;
