"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "@/services/authService";
import Loader from "@/components/Loader";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      setAllowed(true);
    } else {
      router.replace("/login");
    }
  }, [router]);

  // Show nothing protected until we have checked the token
  if (!allowed) return <Loader text="Checking login..." />;

  return children;
}