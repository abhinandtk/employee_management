import ProtectedLayout from "@/components/ProtectedLayout";

export default function EmployeesLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
