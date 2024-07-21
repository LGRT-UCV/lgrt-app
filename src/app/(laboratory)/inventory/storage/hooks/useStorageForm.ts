import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import useNotification from "@/hooks/useNotification";
import type { IStorage, TSaveStorage } from "../interfaces";
import { createStorage, updateStorage } from "../utils";
import { FormInstance } from "antd";

export default function useStorageForm(
  callback: () => void,
  formIntance: FormInstance,
  storageData?: IStorage,
) {
  const [isLoading, setIsLoading] = useState(false);
  const { openNotification, notificationElement } = useNotification();
  const { data: sessionData } = useSession();

  useEffect(() => {
    if (typeof storageData === "undefined") return;
    formIntance.setFieldsValue(storageData);
  }, [storageData]);

  const onFinish = async (values: TSaveStorage) => {
    try {
      const user = sessionData?.user;

      if (typeof user === "undefined") throw new Error("Sesión vencida");

      setIsLoading(true);

      if (!!storageData) {
        await updateStorage(storageData.id, values, user.token);
      } else {
        await createStorage(values, user.token);
      }

      openNotification(
        "success",
        "Laboratorio guardado con exito",
        `El almacenamiento ${values.name} ha sido creado con exito.`,
        "topRight",
      );
      callback();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("ERROR: ", error);
      if (error.message.includes("Storage place already exists")) {
        openNotification(
          "error",
          "El identificador ya existe",
          "Ingrese otro número de identificador",
          "topRight",
        );
      } else {
        openNotification(
          "error",
          "Ha ocurrido un error al guardar el almacenamiento",
          "",
          "topRight",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    notificationElement,
    onFinish,
  };
}
