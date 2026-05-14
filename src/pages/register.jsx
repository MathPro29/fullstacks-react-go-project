import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
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
                    toast.success("Success");
                    reset();
                    setTimeout(() => {
                        navigate("/login");
                    }, 1000);
                } else {
                    toast.error("Username is already taken");
                }
            } else {
                toast.error("Please fill in all fields");
            }
        } catch (error) {
            toast.error("Something went wrong");
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
                                            required: "Please enter username",
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
                                        required: "Please enter email",
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: "Invalid email format",
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
                                    type="password"
                                    {...register("password", {
                                        required: "Please enter password",
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
                                        required: "Please enter fullname",
                                    })}
                                />
                                {errors.fullname && <p>{errors.fullname.message}</p>}
                            </div>
                            <div className="w-full flex justify-start items-center mt-5">
                                <button type="submit" disabled={loading} className="join-btn">
                                    {loading ? "Signing up..." : "Sign up"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
