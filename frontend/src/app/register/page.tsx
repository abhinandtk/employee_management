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
    role: "employee",
  });
  const [error, setError] = useState<any>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("auth/register/", formData);
      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data || "Registration failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="p-8 bg-white shadow-md rounded-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        {error && typeof error === "string" && <p className="text-red-500 text-sm mb-4">{error}</p>}
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Username</label>
          <input name="username" type="text" className="w-full border rounded p-2" onChange={handleChange} required />
          {error?.username && <p className="text-red-500 text-xs mt-1">{error.username}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input name="email" type="email" className="w-full border rounded p-2" onChange={handleChange} required />
          {error?.email && <p className="text-red-500 text-xs mt-1">{error.email}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input name="password" type="password" className="w-full border rounded p-2" onChange={handleChange} required />
          {error?.password && <p className="text-red-500 text-xs mt-1">{error.password}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Role</label>
          <select name="role" className="w-full border rounded p-2" onChange={handleChange} value={formData.role}>
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Register
        </button>
        <p className="mt-4 text-center text-sm">
          Already have an account? <Link href="/login" className="text-blue-600">Login</Link>
        </p>
      </form>
    </div>
  );
}
