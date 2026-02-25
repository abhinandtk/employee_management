"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import { PlusCircle, Edit, Trash2, Search, Users, X, Info } from "lucide-react";
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
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchEmployees = async (query = "") => {
    try {
      setLoading(true);
      const res = await api.get(`employees/${query}`);
      setEmployees(res.data.results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchKey && searchValue) {
      fetchEmployees(`search/?${searchKey}=${searchValue}`);
    } else {
      fetchEmployees();
    }
  };

  const clearSearch = () => {
    setSearchKey('');
    setSearchValue('');
    fetchEmployees();
  };

  const deleteEmployee = async (id: number) => {
    if (confirm("Are you sure you want to delete this employee record?")) {
      try {
        await api.delete(`employees/${id}/`);
        fetchEmployees();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employee Directory</h1>
          <p className="text-gray-500 mt-1">View and manage all employee data entries.</p>
        </div>
        <Link
          href="/employees/create"
          className="flex items-center space-x-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-[0.98] cursor-pointer"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Add New Entry</span>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Search Field</label>
            <input
              type="text"
              placeholder="e.g., First Name"
              className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Value</label>
            <input
              type="text"
              placeholder="Search value..."
              className="w-full border border-gray-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button 
              type="submit" 
              className="flex-1 md:flex-none bg-gray-900 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 cursor-pointer h-[46px]"
            >
              <Search className="w-4 h-4" /> Search
            </button>
            {(searchKey || searchValue) && (
              <button 
                type="button" 
                onClick={clearSearch}
                className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-all cursor-pointer h-[46px]"
                title="Clear Search"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Form Type</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Data Snapshot</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : employees.length > 0 ? (
                employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{emp.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {emp.form_details?.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2 max-w-md">
                        {Object.entries(emp.data || {})
                          .slice(0, 3)
                          .map(([k, v]) => (
                            <span key={k} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-600 border border-gray-200">
                              <span className="font-bold mr-1">{k}:</span> {String(v)}
                            </span>
                          ))}
                        {Object.keys(emp.data || {}).length > 3 && (
                          <span className="text-gray-400 text-xs self-center">...</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-3">
                        <Link 
                          href={`/employees/${emp.id}`} 
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit Entry"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <button 
                          onClick={() => deleteEmployee(emp.id)} 
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                          title="Delete Entry"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <Users className="w-12 h-12 text-gray-200 mb-3" />
                      <p className="text-lg font-medium">No records found</p>
                      <p className="text-sm">Try adjusting your search filters or add a new entry.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
