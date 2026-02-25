"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import { PlusCircle, Edit, Trash2, FileText, Calendar, Hash } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

type Form = {
  id: number;
  name: string;
  created_at: string;
};

export default function FormsPage() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  const fetchForms = async () => {
    try {
      setLoading(true);
      const res = await api.get("forms/");
      setForms(res.data?.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const deleteForm = async (id: number) => {
    if (confirm("Are you sure you want to delete this form? This will affect all employees linked to it.")) {
      try {
        await api.delete(`forms/${id}/`);
        fetchForms();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dynamic Forms</h1>
          <p className="text-gray-500 mt-1">Design and manage custom forms for your organization.</p>
        </div>
        {user?.role === "admin" && (
          <Link
            href="/forms/create"
            className="flex items-center space-x-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-[0.98] cursor-pointer"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Create New Form</span>
          </Link>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Hash className="w-3.5 h-3.5" /> ID
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5" /> Form Name
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" /> Created Date
                  </div>
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
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
              ) : forms.length > 0 ? (
                forms.map((form) => (
                  <tr key={form.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      #{form.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{form.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(form.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => {
                            if (user?.role === "admin") {
                              router.push(`/forms/${form.id}`);
                            } else {
                              alert("Only admins can edit forms.");
                            }
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                          title="Edit Form"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        {user?.role === "admin" && (
                          <button 
                            onClick={() => deleteForm(form.id)} 
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                            title="Delete Form"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <FileText className="w-12 h-12 text-gray-200 mb-3" />
                      <p className="text-lg font-medium">No forms available</p>
                      <p className="text-sm">Get started by creating your first dynamic form.</p>
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
