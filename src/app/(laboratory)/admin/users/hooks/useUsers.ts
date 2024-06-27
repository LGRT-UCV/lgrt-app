import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import type { AnyObject } from "antd/es/_util/type";
import useNotification from "@/hooks/useNotification";
import { deleteUser, getAllUsers } from "../utils";
import type { IUser } from "../interfaces";

export default function useUser () {
  const [searchValue, setSearchValue] = useState("");
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<IUser>();
  const { openNotification, notificationElement } = useNotification();
  const { data: sessionData } = useSession();

  const { data: userList= [], isLoading, refetch } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        return await getAllUsers(sessionData?.user.token ?? "");
      } catch (error) {
        openNotification(
          "error",
          "Ha ocurrido un error al obtener los usuarios",
          "",
          "topRight"
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

  const handleDeleteUser = async (user?: IUser) => {
    if (typeof user === "undefined") {
      openNotification("error", "No se ha seleccionado un usuario a eliminar", "", "topRight");
      return;
    }
  
    try {
      await deleteUser(
        sessionData?.user.token ?? "",
        user.id
      );
      void refetch();
      setCurrentUser(undefined);
      setOpenDetailsModal(false);
      openNotification(
        "success",
        "Laboratorio eliminado",
        `Se ha eliminado el usuario ${user.name}`,
        "topRight"
      );
    } catch (error) {
      console.error("Error", error);
      openNotification("error", "Ha ocurrido un error al eliminar el usuario", "", "topRight");
    }
  };

  const handleUserDetails = (user?: IUser, show = true) => {
    setCurrentUser(user)
    setOpenDetailsModal(show);
  };

  const tableData: Array<AnyObject> = useMemo(() => {
    return userList.map((user, index) => ({
      ...user,
      key: `user-${index}`,
      laboratory: user.laboratory?.name ?? "Sin laboratorio",
    })) ?? [];
  }, [userList, searchValue]);

  return {
    openDetailsModal,
    openCreateModal,
    tableData,
    currentUser,
    userList,
    isLoading,
    notificationElement,
    handleDeleteUser,
    handleUserDetails,
    setOpenCreateModal,
    setOpenDetailsModal,
    setSearchValue,
    handleUpdateUser,
    setCurrentUser,
  };
};