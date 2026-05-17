import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      if (Object.values(data).some((value) => value === "")) {
        toast.error("Please fill in all fields");
        return;
      }

      const res = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const resData = await res.json();

      if (!res.ok || resData.status !== "ok") {
        localStorage.removeItem("token");
        toast.error(
          resData?.error || resData?.message || "Invalid username or password",
        );
        return;
      }

      const token = resData?.data?.token;
      if (!token) {
        localStorage.removeItem("token");
        toast.error("Token not found in login response");
        return;
      }

      localStorage.setItem("token", token);
      toast.success("Login success");
      navigate("/dashboard");
    } catch (error) {
      localStorage.removeItem("token");
      toast.error("Cannot connect to server");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="rounded-md p-4">
        <div className="flex flex-row justify-between">
          <div className="w-full h-full flex justify-center items-center py-5">
            <form onSubmit={handleSubmit(onSubmit)}>
              <h1 className="text-2xl font-bold">Login</h1>
              <div className="flex justify-center items-center gap-5">
                <div className="w-full">
                  <p>Username</p>
                  <input
                    type="text"
                    placeholder="Username"
                    className="w-full border border-gray-300 rounded-md p-2"
                    {...register("username", {
                      required: "Please enter username",
                    })}
                  />
                  {errors.username && <p>{errors.username.message}</p>}
                </div>
              </div>

              <div className="w-full">
                <p>Password</p>
                <input
                  placeholder="Password"
                  className="w-full border border-gray-300 rounded-md p-2"
                  type="password"
                  {...register("password", {
                    required: "Please enter password",
                  })}
                />
                {errors.password && <p>{errors.password.message}</p>}
              </div>

              <div className="w-full flex justify-start items-center mt-5">
                <button type="submit" disabled={loading} className="join-btn">
                  {loading ? "Logging in..." : "LOG IN"}
                </button>
              </div>

              <div className="w-full flex justify-center items-center mt-5">
                <p>Don't have an account?</p>
                <a href="/register">Register</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
