import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import useNotification from "@/hooks/useNotification";
import type { IUser, TUserForm } from "../interfaces";
import { createUser, updateUser } from "../utils";
import { FormInstance } from "antd";

export default function useUserForm (callback: () => void, formIntance: FormInstance, usrData?: IUser) {
  const [isLoading, setIsLoading] = useState(false);
  const { openNotification, notificationElement } = useNotification();
  const { data: sessionData } = useSession();

  useEffect(() => {
    if (typeof usrData === "undefined") return;
    console.log("usrData: ", usrData);
    formIntance.setFieldsValue(usrData);
  }, [usrData]);

  const onFinish = async (values: TUserForm) => {
    try {
      const user = sessionData?.user;

      if (typeof user === "undefined") throw new Error("Sesión vencida");
      
      setIsLoading(true);

      if (!!usrData) {
        const { id, ...rest } = values;
        await updateUser(id, {
          ...rest,
          laboratory: {
            id: values.laboratory,
          },
        }, user.token);
      } else {
        await createUser({
          ...values,
          laboratory: {
            id: values.laboratory,
          },
        }, user.token);
      }

      openNotification(
        "success",
        "Usuario guardado con exito",
        `El usuario ${values.name} ha sido creado con exito.`,
        "topRight"
      );
      callback();
    } catch (error: any) {
      openNotification("error", "Ha ocurrido un error al guardar el usuario", "", "topRight");
      console.log("ERROR: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    notificationElement,
    openNotification,
    onFinish,
  };
};