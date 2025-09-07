import React from "react";
import { Link } from "react-router-dom";
import heroImage from "../assets/vecteezy_data-analysis-concept-illustration-flat-vector-design_10869737.png"; // Add your hero image here
import "./Home.css"
const Home = () => {
  return (
    <div className="home-hero">
      <div className="hero-content">
        <h1 className="hero-title">
          Empower Your School with <span>Smart Student Management</span>
        </h1>
        <p className="hero-subtitle">
          Efficiently manage student records, track academic performance, and generate insightful reports. 
          Stay organized and make data-driven decisions for a brighter future.
        </p>
        <div className="hero-buttons">
          <Link to="/login" className="btn btn-primary">
            Explore
          </Link>
     
        </div>
      </div>
      <div className="hero-image">
        <img src={heroImage} alt="Student Management" />
      </div>
    </div>
  );
};

export default Home;
