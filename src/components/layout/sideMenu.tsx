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

  if (isMobile || true) return <></>;

};