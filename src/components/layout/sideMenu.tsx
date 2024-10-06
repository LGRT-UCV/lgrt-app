"use client";

import React from "react";
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
export default function SideMenu() {
  const { data: sessionData } = useSession();
  const { menuCollapsed, handleMenuCollapsed } = useLabProvider();
  const { items, activeItem } = useMenuItems();

  if (isMobile) return <></>;

  return (
    <Sider
      collapsible
      collapsed={menuCollapsed}
      onCollapse={(value) => handleMenuCollapsed(value)}
      width={250}
    >
      <Avatar
        src="/icons/logo.png"
        label={
          sessionData?.user.user.name + " " + sessionData?.user.user.lastName
        }
        hideLabel={menuCollapsed}
      />
      <Menu theme="dark" mode="inline" items={items} activeKey={activeItem} />
    </Sider>
  );
}
