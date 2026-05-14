import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      if (Object.values(data).every((value) => value !== "")) {
        const res = await fetch("http://localhost:8080/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (res.ok) {
          const resData = await res.json();
          localStorage.setItem("token", resData.token);
          navigate("/dashboard");
          toast.success("สำเร็จ!");
        } else {
          toast.error("รหัสผ่านไม่ถูกต้อง");
        }
      } else {
        toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      }
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด");
      console.error(error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
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
                      required: "กรุณากรอกชื่อผู้ใช้งาน",
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
                  type="text"
                  {...register("password", {
                    required: "กรุณากรอกรหัสผ่าน",
                  })}
                />
                {errors.password && <p>{errors.password.message}</p>}
              </div>

              <div className="w-full flex justify-start items-center mt-5">
                <button type="submit" disabled={loading} className="join-btn">
                  {loading ? "กำลังส่งข้อมูล..." : "LOG IN"}
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
