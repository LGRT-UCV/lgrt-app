"use client";

import { Menu, type MenuProps } from 'antd';
import Sider from "antd/es/layout/Sider";
import {
  ProjectOutlined,
  FileOutlined,
  ProfileOutlined,
  TeamOutlined,
  FileSearchOutlined,
} from '@ant-design/icons';
import { useLabProvider } from "@/providers/laboratoryProvider";
import Avatar from '../dataDisplay/avatar';

type TMenuItem = Required<MenuProps>['items'][number];

/**
 * Side menu component
 * 
 * @returns SideMenu component view
 */
export default function SideMenu () {
  const { menuCollapsed, handleMenuCollapsed } = useLabProvider();

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
    getItem('Inventario', '1', <ProfileOutlined />),
    getItem('Proyectos', '2', <ProjectOutlined />),
    getItem('Solicitudes', '3', <FileSearchOutlined />),
    getItem('Usuarios', '4', <TeamOutlined />),
    getItem('Archivos', '5', <FileOutlined />),
  ];

  return (
    <Sider collapsible collapsed={menuCollapsed} onCollapse={(value) => handleMenuCollapsed(value)}>
      <Avatar
        label="username"
        hideLabel={menuCollapsed}
      />
      <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
    </Sider>
  )
};