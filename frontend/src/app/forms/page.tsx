"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type Form = {
  id: number;
  name: string;
  created_at: string;
};

export default function FormsPage() {
  const [forms, setForms] = useState<Form[]>([]);
  const { user } = useAuth();

  const fetchForms = async () => {
    try {
      const res = await api.get("forms/");
      console.log(res,'checkresponse')
      setForms(res.data?.results);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const deleteForm = async (id: number) => {
    if (confirm("Are you sure you want to delete this form?")) {
      try {
        await api.delete(`forms/${id}/`);
        fetchForms();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dynamic Forms</h1>
        {user?.role === "admin" && (
          <Link
            href="/forms/create"
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Create Form</span>
          </Link>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          {forms&&
          forms?.length>0&&
           <tbody className="bg-white divide-y divide-gray-200">
            {forms?.map((form) => (
              <tr key={form.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{form.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {form.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(form.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                  <Link href={`/forms/${form.id}`} className="text-blue-600 hover:text-blue-900">
                    <Edit className="w-5 h-5 inline" />
                  </Link>
                  {user?.role === "admin" && (
                    <button onClick={() => deleteForm(form.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-5 h-5 inline" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {forms.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No forms available.
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
