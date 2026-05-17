import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = React.useState(null);
  const [originalProfile, setOriginalProfile] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const ValidateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const ValidateFullname = (fullname) => {
    const fullnameRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;
    return fullnameRegex.test(fullname);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (
      profile.fullname === originalProfile.fullname &&
      profile.email === originalProfile.email
    ) {
      toast.info("No changes to update");
      return;
    }

    if (!profile) {
      toast.error("Profile not found");
      return;
    }

    if (!token) {
      navigate("/login");
      return;
    }

    if (!ValidateEmail(profile.email)) {
      toast.error("Invalid email");
      return;
    }

    if (!ValidateFullname(profile.fullname)) {
      toast.error("Invalid fullname");
      return;
    }

    const res = await fetch("http://localhost:8080/users/updateprofile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fullname: profile.fullname,
        email: profile.email,
      }),
    });

    const resData = await res.json();

    if (!res.ok) {
      toast.error(resData?.error || "Update failed");
      return;
    }

    toast.success("Update success");
    navigate("/dashboard");
  };

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
        setOriginalProfile(resData?.data || null);
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

  const handleBack = () => {
    navigate("/dashboard");
    setProfile(null);
    setOriginalProfile(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="rounded-md p-4">
        <div className="flex flex-row justify-between">
          <div className="w-full h-full flex justify-center items-center py-5">
            <form onSubmit={handleUpdate}>
              <h1 className="text-2xl font-bold">Update Profile</h1>
              <div className="flex justify-center items-center gap-5"></div>
              <div className="w-full">
                <p>Email</p>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="w-full">
                <p>Fullname</p>
                <input
                  type="text"
                  placeholder="Fullname"
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={profile.fullname}
                  onChange={(e) =>
                    setProfile({ ...profile, fullname: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex justify-start items-center mt-5 gap-3">
                <button type="submit" disabled={loading} className="join-btn">
                  {loading ? "Updating..." : "Update"}
                </button>
                <button onClick={handleBack} className="join-btn">
                  Back
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
