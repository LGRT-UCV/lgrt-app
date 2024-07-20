"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Routes } from "./lib/constants";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    void router.push(Routes.Login);
  }, []);

  return <div></div>;
}
