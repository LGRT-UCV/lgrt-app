"use client";

import Lottie from "lottie-react";
import Title from "antd/es/typography/Title";
import { LAB_DETAILS } from "@/lib/constants";
import bioAuthAnimation from "@/lib/lottieAnimations/bio-login.json";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-7/12 flex-col items-center justify-center bg-brand-primary p-8 md:flex">
        <Title className="text-center text-brand-dark">
          {LAB_DETAILS.name}
        </Title>
        <Lottie animationData={bioAuthAnimation} className="w-full md:w-3/4" />
      </div>
      <div className="my-auto w-full p-8 md:w-5/12">{children}</div>
    </div>
  );
}
