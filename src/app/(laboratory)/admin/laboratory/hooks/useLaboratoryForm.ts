import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import useNotification from "@/hooks/useNotification";
import type { ILaboratory, TSaveLaboratory } from "../interfaces";
import { createLaboratory, updateLaboratory } from "../utils";
import { FormInstance } from "antd";

export default function useLaboratoryForm (callback: () => void, formIntance: FormInstance, labData?: ILaboratory) {
  const [isLoading, setIsLoading] = useState(false);
  const { openNotification, notificationElement } = useNotification();
  const { data: sessionData } = useSession();

  useEffect(() => {
    if (typeof labData === "undefined") return;
    formIntance.setFieldsValue(labData);
  }, [labData]);

  const onFinish = async (values: TSaveLaboratory) => {
    try {
      const user = sessionData?.user;

      if (typeof user === "undefined") throw new Error("Sesión vencida");
      
      setIsLoading(true);

      if (!!labData) {
        await updateLaboratory(labData.id, values, user.token);
      } else {
        await createLaboratory(values, user.token);
      }

      openNotification(
        "success",
        "Laboratorio guardado con exito",
        `El laboratorio ${values.name} ha sido creado con exito.`,
        "topRight"
      );
      callback();
    } catch (error: any) {
      if (String(error.details).includes("The quantity of a material cannot be greater than")) {
        openNotification(
          "error",
          "No hay cantidad suficiente", "La cantidad de material no puede ser mayor a la cantidad en inventario", "topRight");
      }
      openNotification("error", "Ha ocurrido un error al guardar la solicitud", "", "topRight");
      console.log("ERROR: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    notificationElement,
    onFinish,
  };
};