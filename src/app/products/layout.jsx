import AuthGuard from "@/components/AuthGuard";
import Header from "@/components/Header";

export default function ProductsLayout({ children }) {
  return (
    <AuthGuard>
      <Header />
      <main className="max-w-6xl mx-auto p-4">{children}</main>
    </AuthGuard>
  );
}