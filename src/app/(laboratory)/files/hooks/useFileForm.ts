import { useState } from "react";
import { useSession } from "next-auth/react";
import useNotification from "@/hooks/useNotification";
import type { TFile } from "../interfaces";
import { createFile } from "../utils";
import type { TMaterial } from "@/(laboratory)/inventory/interfaces";

export default function useFileForm (callback: () => void) {
  const { openNotification, notificationElement } = useNotification();
  const { data: sessionData } = useSession();

  const onFinish = async (values: TFile) => {
    try {
      console.log("FILE", values);
      const user = sessionData?.user;

      if (typeof user === "undefined") throw new Error("Sesión vencida");

      const reader = new FileReader();
      if (values.file) {
        reader.readAsDataURL(values.file as Blob);
      }
      reader.onload = () => {
        console.log('Base64 String:', reader.result);
        // You can now use the base64 string (reader.result)
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
      };

      // await createFile({
      //   ...values,
      //   file: [values.file]
      // } , user.token);

      openNotification(
        "success",
        "Archivo guardado con exito",
        `El archivo ha sido guardado con exito.`,
        "topRight"
      );
      callback();
    } catch (error: any) {
      openNotification("error", "Ha ocurrido un error al guardar el archivo", "", "topRight");
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