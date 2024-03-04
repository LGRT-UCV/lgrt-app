import { Layout } from "antd";
import { Header, Content, Footer } from "antd/es/layout/layout";
import SideMenu from "@/components/navigation/sideMenu";
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
            <Header style={{ padding: 0 }} className="bg-gray-200" />
            <Content style={{ margin: '0 16px' }}>
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