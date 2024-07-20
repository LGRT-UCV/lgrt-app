"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useLabProvider } from "@/context/labProvider";
import { Routes } from "@/lib/constants";
import LoginForm from "./loginForm";

export default function Login() {
  const { status } = useSession();
  const { isConnected } = useLabProvider();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && isConnected) {
      void router.push(Routes.Inventory);
    }
  }, [isConnected, status]);

  return <LoginForm />;
}
