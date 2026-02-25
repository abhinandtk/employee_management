"use client";
import { useState } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    first_name: "",
    last_name: "",
    role: "admin",
  });
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for the field being edited
    if (error && typeof error === "object" && error[e.target.name]) {
      const newError = { ...error };
      delete newError[e.target.name];
      setError(newError);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post("auth/register/", formData);
      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <form 
          onSubmit={handleSubmit} 
          className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100 transition-all"
        >
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-500 mt-2">Join our employee management system</p>
          </div>

          {error && typeof error === "string" && (
            <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
              <input 
                name="username" 
                type="text" 
                placeholder="johndoe"
                className={`w-full border rounded-lg p-2.5 transition-all outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  error?.username ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                }`} 
                onChange={handleChange} 
                required 
              />
              {error?.username && <p className="text-red-500 text-xs mt-1 font-medium">{error.username}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
              <input 
                name="email" 
                type="email" 
                placeholder="john@example.com"
                className={`w-full border rounded-lg p-2.5 transition-all outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  error?.email ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                }`} 
                onChange={handleChange} 
                required 
              />
              {error?.email && <p className="text-red-500 text-xs mt-1 font-medium">{error.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input 
                name="password" 
                type="password" 
                placeholder="••••••••"
                className={`w-full border rounded-lg p-2.5 transition-all outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  error?.password ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'
                }`} 
                onChange={handleChange} 
                required 
              />
              {error?.password && <p className="text-red-500 text-xs mt-1 font-medium">{error.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Default Role</label>
              <select 
                name="role" 
                className="w-full border border-gray-300 rounded-lg p-2.5 bg-white cursor-pointer transition-all outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" 
                onChange={handleChange} 
                value={formData.role}
              >
                <option value="admin">Admin</option>
                <option value="employee">Employee</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full mt-8 bg-blue-600 text-white p-3 rounded-lg font-semibold shadow-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all active:scale-[0.98] cursor-pointer flex justify-center items-center ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </>
            ) : 'Create Account'}
          </button>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-semibold hover:underline cursor-pointer">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
