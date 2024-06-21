import { useState } from "react";
import { useSession } from "next-auth/react";
import useNotification from "@/hooks/useNotification";
import type { TFileForm } from "../interfaces";
import { createFile } from "../utils";

export default function useFileForm (callback: () => void) {
  const { openNotification, notificationElement } = useNotification();
  const { data: sessionData } = useSession();

  const onFinish = async (values: TFileForm) => {
    try {
      const user = sessionData?.user;
      const { fileList } = values.file;

      if (typeof user === "undefined") throw new Error("Sesión vencida");
      if (fileList.length === 0 || typeof fileList[0] === "undefined") throw new Error("No se ha seleccionado un archivo");

      const reader = new FileReader();
      reader.readAsDataURL(fileList[0].originFileObj);
      reader.onload = async () => {
        try {
          await createFile({
            name: values.name,
            fileType: ".pdf",
            description: values.description,
            file: String(reader.result ?? "").replace("data:application/pdf;base64,", "")
          } , user.token);
  
          openNotification(
            "success",
            "Archivo guardado con exito",
            `El archivo ha sido guardado con exito.`,
            "topRight"
          );
          callback();
        } catch (error) {
          openNotification("error", "Ha ocurrido un error al guardar el archivo", "", "topRight");
          console.error("ERROR: ", error);
        }
      };
      reader.onerror = (error) => {
        openNotification("error", "Error al leer el archivo", "", "topRight");
        console.error('Error reading file:', error);
      };
    } catch (error: any) {
      openNotification("error", "Ha ocurrido un error al guardar el archivo", (error as Error).message, "topRight");
      console.log("ERROR: ", error);
    }
  };


  return {
    isLoading: false,
    notificationElement,
    openNotification,
    onFinish,
  };
};