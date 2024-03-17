"use client";

import { Menu, type MenuProps } from "antd";
import Sider from "antd/es/layout/Sider";
import {
  ProjectOutlined,
  FileOutlined,
  ProfileOutlined,
  TeamOutlined,
  FileSearchOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useLabProvider } from "../../context/labProvider";
import Avatar from "../dataDisplay/avatar";
import { Roles } from "@/lib/constants";

type TMenuItem = Required<MenuProps>["items"][number];

/**
 * Side menu component
 * 
 * @returns SideMenu component view
 */
export default function SideMenu () {
  const { role, menuCollapsed, handleMenuCollapsed } = useLabProvider();

  /**
   * Get menu item formated
   */
  const getItem = (
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: TMenuItem[],
  ): TMenuItem => {
    return {
      key,
      icon,
      children,
      label,
    } as TMenuItem;
  }
  
  /**
   * Items array to render into the side menu
   */
  const items: TMenuItem[] = [
    getItem("Inventario", "1", <ProfileOutlined />,
      [Roles.Admin, Roles.Internal].includes(role) ?
        [getItem("Añadir nuevo", "inv-1", <PlusOutlined />)]
      : undefined),
    getItem("Proyectos", "2", <ProjectOutlined />),
    getItem("Solicitudes", "3", <FileSearchOutlined />),
    getItem("Usuarios", "4", <TeamOutlined />),
    getItem("Archivos", "5", <FileOutlined />),
  ];

  return (
    <Sider collapsible collapsed={menuCollapsed} onCollapse={(value) => handleMenuCollapsed(value)}>
      <Avatar
        label="username"
        hideLabel={menuCollapsed}
      />
      <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline" items={items} />
    </Sider>
  )
};