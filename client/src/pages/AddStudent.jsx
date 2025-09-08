import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { createStudent } from "../api/students";
import "./AddStudent.css";

const AddStudent = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [preview, setPreview] = useState(null);
  const [showSpinner, setShowSpinner] = useState(false); // Spinner state
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.auth);

  const mutation = useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      // Show spinner for 2 seconds before navigating
      setShowSpinner(true);
      setTimeout(() => {
        reset();
        setPreview(null);
        queryClient.invalidateQueries(["students"]);
        navigate("/students");
      }, 2000);
    },
  });

  if (user?.role !== "Admin") {
    return <p className="not-allowed"> Only Admins can add students.</p>;
  }

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("age", data.age);
    formData.append("class", data.className || "");
    formData.append("grade", data.grade);
    formData.append("section", data.section);
    formData.append("gender", data.gender);
    if (data.image && data.image[0]) formData.append("image", data.image[0]);
    mutation.mutate(formData);
  };

  return (
    <div className="add-student-container">
      {(mutation.isLoading || showSpinner) && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
          <p className="spinner-text">Saving Student...</p>
        </div>
      )}

      <h2 className="form-title">Add Student</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="student-form">
        <div className="form-group">
          <label>Name</label>
          <input {...register("name", { required: "Name is required" })} placeholder="Enter student name" />
          {errors.name && <p className="error-text">{errors.name.message}</p>}
        </div>

        <div className="form-group">
          <label>Age</label>
          <input type="number" {...register("age", { required: "Age is required" })} placeholder="Enter age" />
          {errors.age && <p className="error-text">{errors.age.message}</p>}
        </div>

        <div className="form-group">
          <label>Grade</label>
          <input {...register("grade", { required: "Grade is required" })} placeholder="Enter grade (e.g. 10)" />
          {errors.grade && <p className="error-text">{errors.grade.message}</p>}
        </div>

        <div className="form-group">
          <label>Section</label>
          <input {...register("section", { required: "Section is required" })} placeholder="Enter section (e.g. A)" />
          {errors.section && <p className="error-text">{errors.section.message}</p>}
        </div>

        <div className="form-group">
          <label>Gender</label>
          <select {...register("gender", { required: "Gender is required" })}>
            <option value="">-- Select Gender --</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          {errors.gender && <p className="error-text">{errors.gender.message}</p>}
        </div>

        <div className="form-group">
          <label>Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            {...register("image")}
            onChange={(e) => { if (e.target.files[0]) setPreview(URL.createObjectURL(e.target.files[0])); }}
          />
          {preview && <img src={preview} alt="Preview" className="preview-img" />}
        </div>

        <div className="form-actions">
          <Link to="/students" className="back-btn">← Back</Link>
          <button
            type="submit"
            disabled={mutation.isLoading || showSpinner}
            className="submit-btn"
          >
            Save Student
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudent;
