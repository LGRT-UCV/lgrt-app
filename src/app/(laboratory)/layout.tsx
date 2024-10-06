"use client";

import { Layout } from "antd";
import { Content, Footer } from "antd/es/layout/layout";
import SideMenu from "@/components/layout/sideMenu";
import MobileHeader from "@/components/layout/mobileHeader";

export default function LabLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <Layout hasSider className="min-h-screen">
        <SideMenu />
        <Layout>
          <MobileHeader />
          <Content className="relative flex flex-col gap-8 p-4">
            {children}
          </Content>
          <Footer className="text-center">
            ©{new Date().getFullYear()} Instituto de Ciencia y Tecnología de
            Alimentos, Todos los derechos reservados.
          </Footer>
        </Layout>
      </Layout>
    </main>
  );
}
