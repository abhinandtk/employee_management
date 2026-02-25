"use client";
import { useEffect, useState } from "react";
import FormBuilder from "@/components/FormBuilder";
import api from "@/lib/axios";
import { useParams } from "next/navigation";

export default function EditForm() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await api.get(`forms/${id}/`);
        setForm(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchForm();
  }, [id]);

  if (loading) return <div>Loading form...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Form</h1>
      {form ? <FormBuilder initialForm={form} /> : <p>Form not found.</p>}
    </div>
  );
}
