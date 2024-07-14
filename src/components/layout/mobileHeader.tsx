import { isMobile } from "react-device-detect";
import { Menu } from "antd";
import { Header } from "antd/es/layout/layout";
import { MenuOutlined } from '@ant-design/icons';
import useMenuItems from "@/hooks/useMenuItems";
import Avatar from "../dataDisplay/avatar";

export default function MobileHeader() {
  const items = useMenuItems();


  return (
    <Header style={{ display: "flex", alignItems: "center" }} className="w-full flex justify-between">
      <Avatar
        src="/icons/logo.png"
        hideLabel={isMobile}
        className="mx-0"
      />
      <div>
        <Menu
          theme="dark"
          mode="horizontal"
          items={items}
          style={{ flex: 0, minWidth: 0 }}
        />
      </div>
    </Header>
  );
}