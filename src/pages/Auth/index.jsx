import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      This is after login page
      <button className="btn" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
