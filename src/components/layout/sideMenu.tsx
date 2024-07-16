"use client";

import { Menu } from "antd";
import { useSession } from "next-auth/react";
import { isMobile } from "react-device-detect";
import Sider from "antd/es/layout/Sider";
import { useLabProvider } from "@/context/labProvider";
import Avatar from "../dataDisplay/avatar";
import useMenuItems from "@/hooks/useMenuItems";

/**
 * Side menu component
 * 
 * @returns SideMenu component view
 */
export default function SideMenu () {
  const { data: sessionData } = useSession();
  const { menuCollapsed, handleMenuCollapsed } = useLabProvider();
  const items = useMenuItems();

  if (isMobile) return <></>;

  return (
    <Sider
      collapsible
      collapsed={menuCollapsed}
      onCollapse={(value) => handleMenuCollapsed(value)}
      style={{ overflow: "auto", height: "100vh", position: isMobile ? "fixed" : "relative", left: 0, top: 0, bottom: 0, zIndex: 50 }}>
      <Avatar
        src="/icons/logo.png"
        label={sessionData?.user.user.name + " " + sessionData?.user.user.lastName}
        hideLabel={menuCollapsed}
      />
      <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline" items={items} />
    </Sider>
  );
};