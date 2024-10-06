"use client";

import Lottie from "lottie-react";
import Title from "antd/es/typography/Title";
import { LAB_DETAILS, Routes } from "@/lib/constants";
import bioAuthAnimation from "@/lib/lottieAnimations/bio-login.json";
import { Menu } from "antd";
import { usePathname, useRouter } from "next/navigation";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const items = [
    {
      key: Routes.Login,
      label: "Inciar sesión",
      onClick: () => void router.push(Routes.Login),
    },
    {
      key: Routes.MainCredits,
      label: "Créditos",
      onClick: () => void router.push(Routes.MainCredits),
    },
  ];

  return (
    <div className="flex max-h-dvh min-h-screen overflow-hidden">
      <div className="hidden max-h-dvh w-7/12 flex-col items-center justify-center gap-2 bg-brand-primary p-8 md:flex">
        <Title className="text-center text-brand-dark">
          {LAB_DETAILS.appName}
        </Title>
        <Lottie
          animationData={bioAuthAnimation}
          className="my-auto w-full md:w-4/5"
        />
        <p className="mt-auto">
          ©{new Date().getFullYear()} Instituto de Ciencia y Tecnología de
          Alimentos, Todos los derechos reservados.
        </p>
      </div>
      <div className="h-dvh w-full overflow-y-auto p-8 md:w-5/12">
        <Menu
          mode="horizontal"
          items={items}
          activeKey={pathname}
          className="mb-8 flex justify-center md:justify-end"
        />
        <div
          className={`flex h-[calc(100%-80px)] ${pathname !== Routes.MainCredits ? "flex-col items-center justify-center" : ""}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
