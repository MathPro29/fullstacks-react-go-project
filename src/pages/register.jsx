import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";


export default function Register() {
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            username: "",
            email: "",
            password: "",
            fullname: ""
        },
    });


    const onSubmit = async (data) => {
        try {
            setLoading(true);
            if (Object.values(data).every((value) => value !== "")) {
                const res = await fetch("http://localhost:8080/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });

                if (res.ok) {
                    const responseData = await res.json();
                    console.log("Response:", responseData.message);
                }
                console.log("Form data:", data);
                toast.success("สำเร็จ!");
                setTimeout(() => {
                }, 1000);
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
                            <h1 className="text-2xl font-bold">Register</h1>
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
                                <p>Email</p>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full border border-gray-300 rounded-md p-2"
                                    {...register("email", {
                                        required: "กรุณากรอกอีเมล",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "รูปแบบอีเมลไม่ถูกต้อง",
                                        },
                                    })}
                                />
                                {errors.email && <p>{errors.email.message}</p>}
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
                            <div className="w-full">
                                <p>Fullname</p>
                                <input
                                    type="text"
                                    placeholder="Fullname"
                                    className="w-full border border-gray-300 rounded-md p-2"
                                    {...register("fullname", {
                                        required: "กรุณากรอกชื่อจริงและนามสกุล",
                                    })}
                                />
                                {errors.fullname && <p>{errors.fullname.message}</p>}
                            </div>
                            <div className="w-full flex justify-start items-center mt-5">
                                <button type="submit" disabled={loading} className="join-btn">
                                    {loading ? "กำลังส่งข้อมูล..." : "Sign up"}
                                </button>
                            </div>
                            <span>
                                {/* 
                                    Cookie : token => Tab
                                */}
                            </span>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
