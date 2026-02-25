"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import { PlusCircle, Edit, Trash2, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type Employee = {
  id: number;
  form_details: { name: string };
  data: Record<string, any>;
  created_at: string;
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchKey, setSearchKey] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const { user } = useAuth();

  const fetchEmployees = async (query = "") => {
    try {
      const res = await api.get(`employees/${query}`);
      setEmployees(res.data.results);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchKey && searchValue) {
      // In django backend we built: search API endpoint
      fetchEmployees(`search/?${searchKey}=${searchValue}`);
    } else {
      fetchEmployees();
    }
  };

  const deleteEmployee = async (id: number) => {
    if (confirm("Are you sure you want to delete this employee?")) {
      try {
        await api.delete(`employees/${id}/`);
        fetchEmployees();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Employees</h1>
        <Link
          href="/employees/create"
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Add Employee</span>
        </Link>
      </div>

      <div className="bg-white p-4 rounded-lg shadow border mb-6 flex space-x-4 items-end">
        <form onSubmit={handleSearch} className="flex space-x-4 w-full max-w-2xl">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Search Field (e.g. First Name)</label>
            <input
              type="text"
              placeholder="Field Label"
              className="w-full border p-2 rounded"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Value</label>
            <input
              type="text"
              placeholder="Search value..."
              className="w-full border p-2 rounded"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          <button type="submit" className="bg-gray-100 text-gray-700 px-4 py-2 rounded border hover:bg-gray-200 flex items-center h-10 self-end">
            <Search className="w-4 h-4 mr-2" /> Search
          </button>
          <button type="button" onClick={() => { setSearchKey(''); setSearchValue(''); fetchEmployees(); }} className="text-blue-600 hover:underline text-sm self-center mt-6">
            Clear
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Form</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Snapshot</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          {employees&&
          employees?.length>0&&

            <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{emp.form_details?.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="max-w-md truncate">
                    {Object.entries(emp.data || {})
                      .slice(0, 3)
                      .map(([k, v]) => (
                        <span key={k} className="mr-2 bg-gray-100 px-2 py-1 rounded text-xs">
                          <b>{k}:</b> {String(v)}
                        </span>
                      ))}
                    {Object.keys(emp.data || {}).length > 3 && "..."}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                  <Link href={`/employees/${emp.id}`} className="text-blue-600 hover:text-blue-900">
                    <Edit className="w-5 h-5 inline" />
                  </Link>
                  {(user?.role === "admin" || user?.role === "employee") && (
                    <button onClick={() => deleteEmployee(emp.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-5 h-5 inline" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {employees.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
          }
        
        </table>
      </div>
    </div>
  );
}
