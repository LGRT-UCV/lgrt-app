"use client";

import Lottie from "lottie-react";
import Title from "antd/es/typography/Title";
import { credits, LAB_DETAILS } from "@/lib/constants";
import bioAuthAnimation from "@/lib/lottieAnimations/bio-login.json";
import Credits from "@/components/feedback/credits";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-7/12 flex-col items-center justify-center gap-8 bg-brand-primary p-8 md:flex">
        <Title className="text-center text-brand-dark">
          {LAB_DETAILS.appName}
        </Title>
        <Lottie animationData={bioAuthAnimation} className="w-full md:w-3/4" />
        <Credits people={credits} />
        <p className="mt-auto">LGRT App ©{new Date().getFullYear()}</p>
      </div>
      <div className="my-auto w-full p-8 md:w-5/12">{children}</div>
    </div>
  );
}
