import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import type { AnyObject } from "antd/es/_util/type";
import useNotification from "@/hooks/useNotification";
import { deleteFile, getAllFiles } from "../utils";
import type { IFile } from "../interfaces";

export default function useFile () {
  const [searchValue, setSearchValue] = useState("");
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [currentFile, setCurrentFile] = useState<IFile>();
  const { openNotification, notificationElement } = useNotification();
  const { data: sessionData } = useSession();

  const { data: fileList= [], isLoading, refetch } = useQuery({
    queryKey: ["files"],
    queryFn: async () => {
      try {
        return await getAllFiles(sessionData?.user.token ?? "");
      } catch (error) {
        openNotification(
          "error",
          "Ha ocurrido un error al obtener los archivos",
          "",
          "topRight"
        );
        return [];
      }
    },
    enabled: !!sessionData?.user.token,
  });

  const handleUpdateFile = () => {
    setOpenDetailsModal(false);
    setOpenCreateModal(false);
    void refetch();
  };

  const handleDeleteFile = async (file?: IFile) => {
    if (typeof file === "undefined") {
      openNotification("error", "No se ha seleccionado archivo a eliminar", "", "topRight");
      return;
    }
  
    try {
      await deleteFile(
        sessionData?.user.token ?? "",
        file.id
      );
      void refetch();
      setCurrentFile(undefined);
      setOpenDetailsModal(false);
      openNotification(
        "success",
        "Material eliminado",
        `Se ha eliminado el archivo ${file.id}`,
        "topRight"
      );
    } catch (error) {
      openNotification("error", "Ha ocurrido un error al eliminar el archivo", "", "topRight");
    }
  };

  const handleFileDetails = (file?: IFile, show = true) => {
    setCurrentFile(file)
    setOpenDetailsModal(show);
  };

  const tableData: Array<AnyObject> = useMemo(() => {
    return fileList.map((file, index) => ({
      ...file,
      key: `file-${index}`,
    })) ?? [];
  }, [fileList, searchValue]);

  return {
    openDetailsModal,
    openCreateModal,
    tableData,
    currentFile,
    fileList,
    isLoading,
    notificationElement,
    handleDeleteFile,
    handleFileDetails,
    setOpenDetailsModal,
    setOpenCreateModal,
    setSearchValue,
    handleUpdateFile,
  };
};