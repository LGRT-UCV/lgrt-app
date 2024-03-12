import { Layout } from "antd";
import { Content, Footer } from "antd/es/layout/layout";
import SideMenu from "@/components/layout/sideMenu";
import { LabProvider } from "@/providers/laboratoryProvider";

export default function LabLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <LabProvider>
        <Layout className="min-h-screen">
          <SideMenu />
          <Layout>
            <Content className="p-4">
              {children}
            </Content>
            <Footer className="text-center">
              LGRT ©{new Date().getFullYear()}
            </Footer>
          </Layout>
        </Layout>
      </LabProvider>
    </main>
  );
}