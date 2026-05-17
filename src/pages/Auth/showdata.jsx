import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Showdata = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/users/readall", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((resData) => {
        const nextUsers = Array.isArray(resData)
          ? resData
          : Array.isArray(resData?.data?.users)
            ? resData.data.users
            : Array.isArray(resData?.data)
              ? resData.data
              : [];

        setUsers(nextUsers);
      })
      .catch(() => {
        toast.error("Cannot load users");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full flex flex-col justify-center items-center mt-10 ">
      <h1 className="text-2xl font-bold mb-5">Showing data</h1>
      <table className="border-collapse w-1/2">
        <thead>
          <tr className="bg-gray-100 text-center text-black">
            <th className="border border-gray-300 px-4 py-2">Username</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Full Name</th>
            <th className="border border-gray-300 px-4 py-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((item) => (
            <tr key={item.id}>
              <td className="border border-gray-300 px-4 py-2">
                {item.username}
              </td>
              <td className="border border-gray-300 px-4 py-2">{item.email}</td>
              <td className="border border-gray-300 px-4 py-2">
                {item.fullname}
              </td>
              <td className="border border-gray-300 px-4 py-2">{item.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Showdata;
