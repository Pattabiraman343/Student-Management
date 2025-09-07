import React, { useEffect, useState } from "react";
import { getAllClasses } from "../api/students"; // Adjust path as needed

const ClassList = ({ onSelectClass }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState("");

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = localStorage.getItem("token");
        const classList = await getAllClasses(token);
        setClasses(classList);
      } catch (err) {
        console.error("Failed to load classes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleSelect = (cls) => {
    setSelectedClass(cls);
    if (onSelectClass) onSelectClass(cls); // Notify parent if needed
  };

  return (
    <div className="class-list">
      <h2>Available Classes</h2>
      {loading ? (
        <p>Loading...</p>
      ) : classes.length === 0 ? (
        <p>No classes found.</p>
      ) : (
        <ul>
          {classes.map((cls) => (
            <li
              key={cls}
              onClick={() => handleSelect(cls)}
              style={{
                cursor: "pointer",
                fontWeight: cls === selectedClass ? "bold" : "normal",
              }}
            >
              {cls}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClassList;
