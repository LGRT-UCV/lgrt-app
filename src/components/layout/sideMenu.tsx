"use client";

import { Menu, type MenuProps } from "antd";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { isMobile } from "react-device-detect";
import Sider from "antd/es/layout/Sider";
import {
  ProjectOutlined,
  FileOutlined,
  ProfileOutlined,
  TeamOutlined,
  FileSearchOutlined,
  PlusOutlined,
  LogoutOutlined,
  UnorderedListOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import { useLabProvider } from "@/context/labProvider";
import { Roles, Routes } from "@/lib/constants";
import Avatar from "../dataDisplay/avatar";

type TMenuItem = Required<MenuProps>["items"][number];

/**
 * Side menu component
 * 
 * @returns SideMenu component view
 */
export default function SideMenu () {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const { role, menuCollapsed, handleMenuCollapsed } = useLabProvider();

  /**
   * Get menu item formated
   */
  const getItem = (
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: TMenuItem[],
    onClick?: () => void,
  ): TMenuItem => {
    return {
      key,
      icon,
      children,
      label,
      onClick,
    } as TMenuItem;
  }
  
  /**
   * Items array to render into the side menu
   */
  const items: TMenuItem[] = [
    getItem("Inventario", "1", <ProfileOutlined />,
      [Roles.Admin, Roles.Personal].includes(role) ?
        [
          getItem("Ver todos", "inv-1", <UnorderedListOutlined />, undefined, () => void router.push(Routes.Inventory)),
          getItem("Añadir nuevo", "inv-2", <PlusOutlined />, undefined, () => void router.push(Routes.SaveMaterial))
        ]
      : undefined),
    getItem("Proyectos", "2", <ProjectOutlined />,
      [Roles.Admin, Roles.Personal].includes(role) ?
        [
          getItem("Ver todos", "proj-1", <UnorderedListOutlined />, undefined, () => void router.push(Routes.Projects)),
          getItem("Añadir nuevo", "proj-2", <PlusOutlined />, undefined, () => void router.push(Routes.SaveProject))
        ]
      : undefined),
    getItem("Solicitudes", "3", <FileSearchOutlined />, undefined, () => void router.push(Routes.Requests)),
    getItem("Usuarios", "4", <TeamOutlined />, 
      [Roles.Admin].includes(role) ?
        [
          getItem("Ver todos", "users-1", <UnorderedListOutlined />, undefined, () => void router.push(Routes.Users)),
          getItem("Laboratorios", "labs-2", <ExperimentOutlined />, undefined, () => void router.push(Routes.Laboratory))
        ]
      : undefined),
    getItem("Archivos", "5", <FileOutlined />, undefined, () => void router.push(Routes.Files)),
    { type: "divider" },
    getItem("Cerrar Sesión", "6", <LogoutOutlined />, undefined, () => void signOut()),
  ];

  return (
    <Sider
      collapsible
      collapsed={menuCollapsed}
      onCollapse={(value) => handleMenuCollapsed(value)}
      style={{ overflow: "auto", height: "100vh", position: isMobile ? "fixed" : "relative", left: 0, top: 0, bottom: 0, zIndex: 50 }}>
      <Avatar
        label={sessionData?.user.user.name + " " + sessionData?.user.user.lastName}
        hideLabel={menuCollapsed}
      />
      <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline" items={items} />
    </Sider>
  )
};