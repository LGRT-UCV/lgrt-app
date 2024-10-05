"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Routes } from "./lib/constants";
import { useLabProvider } from "@/context/labProvider";
import { useSession } from "next-auth/react";

export default function Init() {
  const { status } = useSession();
  const { isConnected } = useLabProvider();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && isConnected) {
      void router.push(Routes.Home);
    } else {
      void router.push(Routes.Login);
    }
  }, [status, isConnected]);

  return <div></div>;
}
