import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "antd/es/form/Form";
import { useQuery } from "@tanstack/react-query";
import type { AnyObject } from "antd/es/_util/type";
import useNotification from "@/hooks/useNotification";
import { getAllUsers, updateUser, userRoles } from "../utils";
import type { IUser, TStatus } from "../interfaces";

export default function useUser() {
  const [form] = useForm();
  const [searchValue, setSearchValue] = useState("");
  const [userStatus, setUserStatus] = useState<string>("all");
  const [userRole, setUserRole] = useState<string>("all");
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<IUser>();
  const { openNotification, notificationElement } = useNotification();
  const { data: sessionData } = useSession();

  const {
    data: userList = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        return await getAllUsers(sessionData?.user.token ?? "");
      } catch (error) {
        openNotification(
          "error",
          "Ha ocurrido un error al obtener los usuarios",
          "",
          "topRight",
        );
        return [];
      }
    },
    enabled: !!sessionData?.user.token,
  });

  const handleUpdateUser = () => {
    setOpenCreateModal(false);
    void refetch();
  };

  const handleUserStatus = async (userId: string, status: TStatus) => {
    if (userId === "") {
      openNotification(
        "error",
        "No se ha seleccionado un usuario a eliminar",
        "",
        "topRight",
      );
      return;
    }

    try {
      await updateUser(
        userId,
        {
          status: status,
        },
        sessionData?.user.token ?? "",
      );
      void refetch();
      setOpenDetailsModal(false);
      openNotification("success", "", "Usuario actualizado", "topRight");
    } catch (error) {
      console.error("Error", error);
      openNotification(
        "error",
        "Ha ocurrido un error al eliminar el usuario",
        "",
        "topRight",
      );
    }
  };

  const handleUserDetails = (user?: IUser, show = true) => {
    setCurrentUser(user);
    setOpenDetailsModal(show);
  };

  const tableData: Array<AnyObject> = useMemo(() => {
    const search = searchValue.toLocaleLowerCase();
    const users = userList.filter((user) => {
      const userFullName = `${user.name} ${user.lastName}`;
      return (
        (user.id.toLocaleLowerCase().includes(search) ||
          userFullName.toLocaleLowerCase().includes(search) ||
          user.laboratory.name.toLocaleLowerCase().includes(search)) &&
        (userStatus === "all" || user.status === userStatus) &&
        (userRole === "all" || user.idRoleId === userRole)
      );
    });
    return (
      users.map((user, index) => ({
        ...user,
        key: `user-${index}`,
        idRoleId: Number(user.idRoleId),
        laboratoryName: user.laboratory.name,
        role:
          userRoles.find((role) => role.id === Number(user.idRoleId))
            ?.roleName ?? "External",
      })) ?? []
    );
  }, [userList, searchValue, userStatus, userRole]);

  useEffect(() => {
    if (!openCreateModal) {
      setCurrentUser(undefined);
      form.resetFields();
    }
  }, [openCreateModal]);

  return {
    form,
    openDetailsModal,
    openCreateModal,
    tableData,
    currentUser,
    userList,
    isLoading,
    notificationElement,
    handleUserStatus,
    handleUserDetails,
    setOpenCreateModal,
    setOpenDetailsModal,
    setUserStatus,
    setUserRole,
    setSearchValue,
    handleUpdateUser,
    setCurrentUser,
  };
}
