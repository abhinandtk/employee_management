"use client";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">Welcome back, {user?.username}!</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-md">
            <h3 className="font-medium text-blue-800">Your Role</h3>
            <p className="text-blue-600 capitalize mt-1">{user?.role}</p>
          </div>
          <div className="p-4 bg-green-50 border border-green-100 rounded-md">
            <h3 className="font-medium text-green-800">Account Details</h3>
            <p className="text-green-600 mt-1">{user?.email}</p>
          </div>
        </div>
        <p className="mt-6 text-gray-600">
          Use the sidebar to navigate through the Employee Management System.
          {user?.role === "admin" && " As an admin, you can create dynamic forms and manage employees."}
        </p>
      </div>
    </div>
  );
}
