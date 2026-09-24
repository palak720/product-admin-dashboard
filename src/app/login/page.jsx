"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login, isLoggedIn } from "@/services/authService";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Blocks repeat submits instantly (state updates are async, a ref is not)
  const submittingRef = useRef(false);

  // Already logged in? Skip the login page
  useEffect(() => {
    if (isLoggedIn()) router.replace("/products");
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (submittingRef.current) return;

    if (!username.trim() || !password) {
      setError("Please enter both username and password.");
      return;
    }

    submittingRef.current = true;
    setLoading(true);
    setError("");

    try {
      await login(username.trim(), password);
      router.replace("/products");
    } catch (err) {
      setError(err.message);
      submittingRef.current = false;
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-6 rounded-lg shadow space-y-4"
      >
        <h1 className="text-2xl font-semibold text-center">Admin Login</h1>

        {error && (
          <div role="alert" className="bg-red-50 text-red-700 text-sm p-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="username" className="block text-sm mb-1">Username</label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border rounded px-3 py-2"
            autoComplete="username"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm mb-1">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
            autoComplete="current-password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </main>
  );
}