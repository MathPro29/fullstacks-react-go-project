import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:8080/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const resData = await res.json();

        if (!res.ok) {
          localStorage.removeItem("token");
          toast.error(resData?.error || "Session expired");
          navigate("/login");
          return;
        }

        setProfile(resData?.data || null);
      } catch (error) {
        localStorage.removeItem("token");
        toast.error("Cannot load profile");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logout success");
    navigate("/login");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">This is after login page</h1>
      {profile && (
        <div className="mt-4">
          <p>Welcome, {profile.fullname}</p>
          <p>Username: {profile.username}</p>
          <p>Email: {profile.email}</p>
        </div>
      )}
      <button className="btn mt-4" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
