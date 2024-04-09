import { Layout } from "antd";
import { Content, Footer } from "antd/es/layout/layout";
import { LabProvider } from "@/context/labProvider";
import SideMenu from "@/components/layout/sideMenu";

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
            <Content className="flex flex-col gap-8 p-8">
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