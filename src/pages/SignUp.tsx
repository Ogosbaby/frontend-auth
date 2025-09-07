import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

type SignUpFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};
const schema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[0-9]/, "Password must include a number")
      .regex(/[^a-zA-Z0-9]/, "Password must include a symbol"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function SignUp() {
  const { signUp, loading, error } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      await signUp(data.username, data.email, data.password);
      alert("Verification link sent to your email.");
      navigate("/signin");
    } catch (err) {
      console.error("Sign up failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        {/* Username */}
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-gray-700 dark:text-gray-300 mb-1"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            {...register("username")}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                       dark:bg-gray-700 dark:text-white"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
          )}
        </div>
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
            autoComplete="email"
            {...register("email")}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                       dark:bg-gray-700 dark:text-white"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 dark:text-gray-300 mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            {...register("password")}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                       dark:bg-gray-700 dark:text-white"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-gray-700 dark:text-gray-300 mb-1"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            {...register("confirmPassword")}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                       dark:bg-gray-700 dark:text-white"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded 
                     transition disabled:bg-gray-400"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Sign In
          </Link>
        </p>
      </form>
    </div>
  );
}
