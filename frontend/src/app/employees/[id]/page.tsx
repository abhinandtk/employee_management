"use client";
import EmployeeForm from "@/components/EmployeeForm";
import { useParams } from "next/navigation";

export default function EditEmployee() {
  const { id } = useParams();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Employee</h1>
      {id && <EmployeeForm employeeId={id as string} />}
    </div>
  );
}
