import ProtectedLayout from "@/components/ProtectedLayout";

export default function FormsLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
