import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const RENDER_BASE_URL = "https://student-management-lc6d.onrender.com/api";

// Helper to get auth headers
const getAuthHeaders = (isFormData = false) => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
  };
};

// Fetch student by ID from Render
const fetchStudentById = async (id) => {
  const res = await axios.get(`${RENDER_BASE_URL}/students/${id}`, { headers: getAuthHeaders() });
  return res.data;
};

// Update student on Render
const updateStudentById = async (id, formData) => {
  const res = await axios.put(`${RENDER_BASE_URL}/students/${id}`, formData, { headers: getAuthHeaders(true) });
  return res.data;
};

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    fetchStudentById(id).then((data) => {
      setValue("name", data.name);
      setValue("age", data.age);
      setValue("className", data.class);
      setValue("grade", data.grade);
      setValue("section", data.section);
      setValue("gender", data.gender);
      if (data.image) setPreview(`${RENDER_BASE_URL.replace("/api", "")}/uploads/${data.image}`);
    });
  }, [id, setValue]);

  const mutation = useMutation({
    mutationFn: (formData) => updateStudentById(id, formData),
    onSuccess: () => navigate("/students"),
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("age", data.age);
    formData.append("class", data.className);
    formData.append("grade", data.grade);
    formData.append("section", data.section);
    formData.append("gender", data.gender);
    if (data.image && data.image[0]) formData.append("image", data.image[0]);

    mutation.mutate(formData);
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-xl p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">✏️ Edit Student</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register("name")} placeholder="Name" />
        <input type="number" {...register("age")} placeholder="Age" />
        <input {...register("grade")} placeholder="Grade" />
        <input {...register("section")} placeholder="Section" />
        <input {...register("className")} placeholder="Class" />
        <select {...register("gender")}>
          <option value="">-- Select Gender --</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <input
          type="file"
          accept="image/*"
          {...register("image")}
          onChange={(e) => {
            if (e.target.files[0]) setPreview(URL.createObjectURL(e.target.files[0]));
          }}
        />
        {preview && <img src={preview} alt="Preview" className="mt-2 w-24 h-24 rounded-md object-cover" />}
        <button type="submit">{mutation.isLoading ? "Updating..." : "Update Student"}</button>
      </form>
    </div>
  );
};

export default EditStudent;
