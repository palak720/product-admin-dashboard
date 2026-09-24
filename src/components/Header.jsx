"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/services/authService";

export default function Header() {
  const router = useRouter();

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <header className="bg-white border-b">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <Link href="/products" className="text-lg font-semibold">
          Product Admin
        </Link>
        <button
          onClick={handleLogout}
          className="text-sm border rounded px-3 py-1.5 hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </header>
  );
}