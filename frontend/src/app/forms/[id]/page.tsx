"use client";
import { useEffect, useState } from "react";
import FormBuilder from "@/components/FormBuilder";
import api from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function EditForm() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user && user.role !== "admin") {
      alert("Only admins can edit forms.");
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

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
