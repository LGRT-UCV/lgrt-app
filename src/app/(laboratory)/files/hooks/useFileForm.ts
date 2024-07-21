import { useSession } from "next-auth/react";
import useNotification from "@/hooks/useNotification";
import type { IFile, TFileForm } from "../interfaces";
import { createFile, updateFile } from "../utils";

export default function useFileForm(callback: () => void, fileData?: IFile) {
  const { openNotification, notificationElement } = useNotification();
  const { data: sessionData } = useSession();

  const onFinish = async (values: TFileForm) => {
    try {
      const user = sessionData?.user;

      if (typeof user === "undefined") throw new Error("Sesión vencida");

      if (typeof fileData === "undefined") {
        const { fileList } = values.file;
        if (fileList.length === 0 || typeof fileList[0] === "undefined")
          throw new Error("No se ha seleccionado un archivo");
        const reader = new FileReader();
        reader.readAsDataURL(fileList[0].originFileObj);
        reader.onload = async () => {
          try {
            await createFile(
              {
                name: values.name,
                fileType: ".pdf",
                description: values.description,
                file: String(reader.result ?? "").replace(
                  "data:application/pdf;base64,",
                  "",
                ),
              },
              user.token,
            );

            openNotification(
              "success",
              "Archivo guardado con exito",
              `El archivo ha sido guardado con exito.`,
              "topRight",
            );
            callback();
          } catch (error) {
            openNotification(
              "error",
              "Ha ocurrido un error al guardar el archivo",
              "",
              "topRight",
            );
            console.error("ERROR: ", error);
          }
        };
        reader.onerror = (error) => {
          openNotification("error", "Error al leer el archivo", "", "topRight");
          console.error("Error reading file:", error);
        };
      } else {
        await updateFile(
          fileData.id,
          {
            name: values.name,
            description: values.description,
          },
          user.token,
        );
        callback();
        openNotification(
          "success",
          "Archivo guardado con exito",
          `El archivo ha sido guardado con exito.`,
          "topRight",
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      openNotification(
        "error",
        "Ha ocurrido un error al guardar el archivo",
        (error as Error).message,
        "topRight",
      );
      console.log("ERROR: ", error);
    }
  };

  return {
    isLoading: false,
    notificationElement,
    openNotification,
    onFinish,
  };
}
