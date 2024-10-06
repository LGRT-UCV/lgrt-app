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
  UserOutlined,
  CrownOutlined,
  SlidersOutlined,
  QuestionOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Roles, Routes } from "@/lib/constants";
import { getMenuItem } from "@/utils/layout";
import type { TMenuItem } from "@/types/app";
import { useLabProvider } from "@/context/labProvider";
import { useMemo, useState } from "react";
import { MANUAL_APP_URI } from "@/utils";

export default function useMenuItems({
  closeMenu,
}: { closeMenu?: () => void } | undefined = {}) {
  const router = useRouter();
  const { role } = useLabProvider();
  const [activeItem, setActiveItem] = useState<string>();

  const handleMenuClick = (route: Routes, key: string) => {
    setActiveItem(key);
    void router.push(route);
    closeMenu?.();
  };

  /**
   * Items array to render into the side menu
   */
  const items: TMenuItem[] = useMemo(() => {
    return [
      getMenuItem("Inicio", "0", <HomeOutlined />, undefined, () =>
        handleMenuClick(Routes.Home, "0"),
      ),
      getMenuItem(
        "Inventario",
        "1",
        <ProfileOutlined />,
        [Roles.Admin, Roles.Personal, Roles.PersonalExtra].includes(role)
          ? [
              getMenuItem(
                "Ver todos",
                "inv-1",
                <UnorderedListOutlined />,
                undefined,
                () => handleMenuClick(Routes.Inventory, "inv-1"),
              ),
              getMenuItem(
                "Añadir nuevo",
                "inv-2",
                <PlusOutlined />,
                undefined,
                () => handleMenuClick(Routes.SaveMaterial, "inv-2"),
              ),
              getMenuItem(
                "Materiales",
                "inv-3",
                <SlidersOutlined />,
                undefined,
                () => handleMenuClick(Routes.MaterialType, "inv-3"),
              ),
              getMenuItem(
                "Almacenamiento",
                "inv-4",
                <DatabaseOutlined />,
                undefined,
                () => handleMenuClick(Routes.Storage, "inv-4"),
              ),
            ]
          : undefined,
        ![Roles.Admin, Roles.Personal, Roles.PersonalExtra].includes(role)
          ? () => handleMenuClick(Routes.Inventory, "1")
          : undefined,
      ),
      getMenuItem("Proyectos", "2", <ProjectOutlined />, [
        getMenuItem(
          "Ver todos",
          "proj-1",
          <UnorderedListOutlined />,
          undefined,
          () => handleMenuClick(Routes.Projects, "proj-1"),
        ),
        [Roles.Admin, Roles.Personal, Roles.PersonalExtra].includes(role)
          ? getMenuItem(
              "Añadir nuevo",
              "proj-2",
              <PlusOutlined />,
              undefined,
              () => handleMenuClick(Routes.SaveProject, "proj-2"),
            )
          : undefined,
      ]),
      getMenuItem("Solicitudes", "3", <FileSearchOutlined />, undefined, () =>
        handleMenuClick(Routes.Requests, "3"),
      ),
      [Roles.Admin].includes(role)
        ? getMenuItem("Usuarios", "4", <TeamOutlined />, [
            getMenuItem(
              "Ver todos",
              "users-1",
              <UnorderedListOutlined />,
              undefined,
              () => handleMenuClick(Routes.Users, "users-1"),
            ),
            getMenuItem(
              "Laboratorios",
              "labs-2",
              <ExperimentOutlined />,
              undefined,
              () => handleMenuClick(Routes.Laboratory, "labs-2"),
            ),
          ])
        : undefined,
      getMenuItem("Archivos", "5", <FileOutlined />, undefined, () =>
        handleMenuClick(Routes.Files, "5"),
      ),
      { type: "divider" },
      getMenuItem("Perfil", "6", <UserOutlined />, undefined, () =>
        handleMenuClick(Routes.Profile, "6"),
      ),
      getMenuItem(
        "Manual de usuario",
        "7",
        <QuestionOutlined />,
        undefined,
        () => window.open(MANUAL_APP_URI, "_blank"),
      ),
      getMenuItem("Créditos", "8", <CrownOutlined />, undefined, () =>
        handleMenuClick(Routes.Credits, "8"),
      ),
      getMenuItem(
        "Cerrar Sesión",
        "9",
        <LogoutOutlined />,
        undefined,
        () => void signOut(),
      ),
    ];
  }, [role]);

  return { items, activeItem };
}
