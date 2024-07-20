"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Routes } from "./lib/constants";
import { useLabProvider } from "@/context/labProvider";
import { useSession } from "next-auth/react";

export default function Home() {
  const { status } = useSession();
  const { isConnected } = useLabProvider();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && isConnected) {
      void router.push(Routes.Inventory);
    } else {
      void router.push(Routes.Login);
    }
  }, [status, isConnected]);

  return <div></div>;
}
