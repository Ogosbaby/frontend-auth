import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import apiClient from "../api/apiClient";

// Validation schemas
const requestSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const resetSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[0-9]/, "Must include a number")
    .regex(/[^a-zA-Z0-9]/, "Must include a symbol"),
});

// Types
type RequestFormData = { email: string };
type ResetFormData = { password: string };

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const stage = token ? "reset" : "request";
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestFormData | ResetFormData>({
    resolver: zodResolver(stage === "reset" ? resetSchema : requestSchema),
  });

  const onSubmit = async (data: RequestFormData | ResetFormData) => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (stage === "request") {
        await apiClient.post("/auth/forgot-password", {
          email: (data as RequestFormData).email,
        });
        setMessage("Reset link sent. Check your email.");
      } else {
        await apiClient.post("/auth/reset-password", {
          token,
          password: (data as ResetFormData).password,
        });
        setMessage("Password reset successful.");
        setTimeout(() => navigate("/signin"), 2000);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          {stage === "reset" ? "Reset Password" : "Forgot Password"}
        </h2>

        {stage === "request" && (
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 dark:text-gray-300 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         dark:bg-gray-700 dark:text-white"
            />
            {"email" in errors && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email?.message}
              </p>
            )}
          </div>
        )}

        {stage === "reset" && (
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 dark:text-gray-300 mb-1"
            >
              New Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
                         dark:bg-gray-700 dark:text-white"
            />
            {"password" in errors && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password?.message}
              </p>
            )}
          </div>
        )}

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {message && <p className="text-green-500 text-sm mb-4">{message}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded 
                     transition disabled:bg-gray-400"
        >
          {loading
            ? "Processing..."
            : stage === "reset"
            ? "Reset Password"
            : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}
