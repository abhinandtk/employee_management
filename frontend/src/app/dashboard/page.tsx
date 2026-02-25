"use client";
import { useAuth } from "@/context/AuthContext";
import { User, ShieldCheck, Mail, Calendar } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-2">Welcome back to your employee management portal.</p>
      </header>
      
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all">
        <div className="bg-blue-600 p-8 text-white relative">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <User className="w-6 h-6" />
              Hi, {user?.username}!
            </h2>
            <p className="opacity-90 mt-1">Manage your forms and employee data with ease.</p>
          </div>
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <User className="w-32 h-32" />
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group p-6 bg-blue-50 border border-blue-100 rounded-xl transition-all hover:shadow-md cursor-default">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-600 text-white rounded-lg shadow-blue-200 shadow-lg">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-blue-900">Your Role</h3>
              </div>
              <p className="text-blue-700 capitalize text-lg font-medium">{user?.role}</p>
            </div>

            <div className="group p-6 bg-green-50 border border-green-100 rounded-xl transition-all hover:shadow-md cursor-default">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-600 text-white rounded-lg shadow-green-200 shadow-lg">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-green-900">Account Email</h3>
              </div>
              <p className="text-green-700 text-lg font-medium">{user?.email}</p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="p-2 bg-gray-200 text-gray-700 rounded-lg">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Getting Started</h4>
                <p className="text-gray-600 mt-1">
                  Use the sidebar to navigate through the Employee Management System.
                  {user?.role === "admin" 
                    ? " As an administrator, you have full access to create dynamic forms, manage fields, and oversee all employee records."
                    : " You can browse through your assigned forms and manage employee data entries."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
