"use client";
import React, { useState, useEffect } from "react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

export default function EmployeeForm({ employeeId }: { employeeId?: string }) {
  const [forms, setForms] = useState<any[]>([]);
  const [selectedFormId, setSelectedFormId] = useState<string>("");
  const [formData, setFormData] = useState<any>(null); // Details of the selected form
  const [employeeData, setEmployeeData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch all available forms
        const formsRes = await api.get("forms/");
        setForms(formsRes.data.results);

        if (employeeId) {
          // If editing, fetch employee and set selected form
          const empRes = await api.get(`employees/${employeeId}/`);
          setSelectedFormId(empRes.data.form.toString());
          setFormData(empRes.data.form_details);
          setEmployeeData(empRes.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [employeeId]);

  useEffect(() => {
    // When a form is selected (and we are NOT just loading an existing employee's form), fetch its details
    const fetchFormDetails = async () => {
      if (!selectedFormId) return;
      try {
        const res = await api.get(`forms/${selectedFormId}/`);
        setFormData(res.data);
        // If creating new, initialize employeeData with empty strings for each field
        if (!employeeId) {
          const initialData: Record<string, any> = {};
          res.data.fields.forEach((f: any) => {
            initialData[f.label] = "";
          });
          setEmployeeData(initialData);
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (selectedFormId && !employeeId) {
       fetchFormDetails();
    } else if (employeeId && formData && selectedFormId !== formData.id.toString()) {
       fetchFormDetails();
    }
  }, [selectedFormId]);

  const handleChange = (label: string, value: any) => {
    setEmployeeData((prev) => ({ ...prev, [label]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        form: selectedFormId,
        data: employeeData,
      };

      if (employeeId) {
        await api.put(`employees/${employeeId}/`, payload);
      } else {
        await api.post("employees/", payload);
      }
      router.push("/employees");
    } catch (err) {
      console.error(err);
      alert("Error saving employee data");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow border">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-700">Select Form Template</label>
          <select
            className="w-full border p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={selectedFormId}
            onChange={(e) => setSelectedFormId(e.target.value)}
            disabled={!!employeeId} // Typically you don't change the form type of an existing record
            required
          >
            <option value="">-- Choose a Form --</option>
            {forms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        {formData && formData.fields && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2 mb-4">Employee Details</h3>
            {formData.fields.map((field: any) => (
              <div key={field.id} className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">{field.label}</label>
                <input
                  type={field.field_type === "text" || field.field_type === "number" || field.field_type === "date" || field.field_type === "password" ? field.field_type : "text"}
                  className="w-full border p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={employeeData[field.label] || ""}
                  onChange={(e) => handleChange(field.label, e.target.value)}
                  required
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 pt-4 border-t flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            disabled={!selectedFormId || !formData}
          >
            {employeeId ? "Update Employee" : "Save Employee"}
          </button>
        </div>
      </form>
    </div>
  );
}
