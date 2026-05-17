import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AlertDelete from "../../components/alertdel";
import Sidebar from "../../components/sidebar";

const Dashboard = () => {
  const DELETE_REDIRECT_DELAY_MS = 450;
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteClosing, setDeleteClosing] = useState(false);

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

  const handleDelete = async () => {
    setDeleteClosing(false);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setShowDeleteConfirm(false);
      navigate("/login");
      return;
    }

    try {
      setDeleting(true);

      const res = await fetch("http://localhost:8080/users/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const resData = await res.json();

      if (!res.ok) {
        toast.error(resData?.error || "Delete failed");
        return;
      }

      localStorage.removeItem("token");
      setDeleteClosing(true);
      toast.success("Delete success");
      window.setTimeout(() => {
        setShowDeleteConfirm(false);
        navigate("/login");
      }, DELETE_REDIRECT_DELAY_MS);
    } catch (error) {
      toast.error("Cannot delete user");
    } finally {
      setDeleting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logout success");
    navigate("/login");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="p-6">
        <AlertDelete
          open={showDeleteConfirm}
          loading={deleting}
          closing={deleteClosing}
          onConfirm={confirmDelete}
          onCancel={() => {
            setDeleteClosing(false);
            setShowDeleteConfirm(false);
          }}
        />
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
        <button className="btn mt-4" onClick={() => navigate("/updateprofile")}>
          Update Profile
        </button>
        <button
          className="btn mt-4 bg-red-500 text-white"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Delete User"}
        </button>
      </div>
    </>
  );
};

export default Dashboard;
