import React from "react";

const Adminlayout = () => {
  return (
    <div>
      <h1>This is admin page</h1>
      <a href="/login">Login</a>
      <a href="/register">Register</a>
      <a href="/updateprofile">Update Profile</a>
      <a href="/deleteprofile">Delete Profile</a>
    </div>
  );
};

export default Adminlayout;
