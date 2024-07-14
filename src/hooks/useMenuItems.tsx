import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
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
  DatabaseOutlined,
} from "@ant-design/icons";
import { Roles, Routes } from "@/lib/constants";
import { getMenuItem } from "@/utils/layout";
import type { TMenuItem } from "@/types/app";
import { useLabProvider } from "@/context/labProvider";
import { useMemo } from "react";

export default function useMenuItems() {
  const router = useRouter();
  const { role } = useLabProvider();

  /**
   * Items array to render into the side menu
   */
  const items: TMenuItem[] = useMemo(() => {
    return [
      getMenuItem("Inventario", "1", <ProfileOutlined />,
        [Roles.Admin, Roles.Personal].includes(role) ?
          [
            getMenuItem("Ver todos", "inv-1", <UnorderedListOutlined />, undefined, () => void router.push(Routes.Inventory)),
            getMenuItem("Añadir nuevo", "inv-2", <PlusOutlined />, undefined, () => void router.push(Routes.SaveMaterial)),
            getMenuItem("Almacen", "inv-3", <DatabaseOutlined />, undefined, () => void router.push(Routes.Storage))
          ]
        : undefined),
      getMenuItem("Proyectos", "2", <ProjectOutlined />,
        [Roles.Admin, Roles.Personal].includes(role) ?
          [
            getMenuItem("Ver todos", "proj-1", <UnorderedListOutlined />, undefined, () => void router.push(Routes.Projects)),
            getMenuItem("Añadir nuevo", "proj-2", <PlusOutlined />, undefined, () => void router.push(Routes.SaveProject))
          ]
        : undefined),
      getMenuItem("Solicitudes", "3", <FileSearchOutlined />, undefined, () => void router.push(Routes.Requests)),
      getMenuItem("Usuarios", "4", <TeamOutlined />, 
        [Roles.Admin].includes(role) ?
          [
            getMenuItem("Ver todos", "users-1", <UnorderedListOutlined />, undefined, () => void router.push(Routes.Users)),
            getMenuItem("Laboratorios", "labs-2", <ExperimentOutlined />, undefined, () => void router.push(Routes.Laboratory))
          ]
        : undefined),
      getMenuItem("Archivos", "5", <FileOutlined />, undefined, () => void router.push(Routes.Files)),
      { type: "divider" },
      getMenuItem("Cerrar Sesión", "6", <LogoutOutlined />, undefined, () => void signOut()),
    ];
  }, []);

  return items;
}