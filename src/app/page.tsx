"use client";

import Lottie from "lottie-react";
import Title from "antd/es/typography/Title";
import LoginForm from "@/components/layout/loginForm";
import { LAB_DETAILS } from "@/lib/constants";
import bioLoginAnimation from "@/lib/lottieAnimations/bio-login.json";

export default function Home() {
  return (
    <main className="flex min-h-screen">
      <div className="w-7/12 hidden md:flex flex-col items-center justify-center bg-brand-primary p-8">
        <Title className="text-brand-dark text-center">{LAB_DETAILS.name}</Title>
        <Lottie animationData={bioLoginAnimation} className="w-full md:w-3/4"/>
      </div>
      <div className="w-full md:w-5/12 p-8 my-auto">
        <LoginForm />
      </div>
    </main>
  );
}
