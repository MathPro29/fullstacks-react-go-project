import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-4">
      <h1 className="text-3xl font-bold">This is Main page</h1>
      <div className="w-full flex justify-center items-center gap-4">
        <button className="register-btn" onClick={() => navigate("/register")}>
          Register
        </button>
        <button className="login-btn" onClick={() => navigate("/login")}>
          Login
        </button>
      </div>
    </div>
  );
};

export default Home;
