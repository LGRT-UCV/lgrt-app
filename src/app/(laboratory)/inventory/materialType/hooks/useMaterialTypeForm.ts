import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import useNotification from "@/hooks/useNotification";
import type {
  IMaterialType,
  TFields,
  TSaveMaterialType,
  TSaveMaterialTypeForm,
} from "../interfaces";
import { createMaterialType, updateMaterialType } from "../utils";
import { FormInstance } from "antd";

export default function useMaterialTypeForm(
  callback: () => void,
  formIntance: FormInstance,
  materialTypeData?: IMaterialType,
) {
  const [isLoading, setIsLoading] = useState(false);
  const { openNotification, notificationElement } = useNotification();
  const { data: sessionData } = useSession();

  useEffect(() => {
    if (typeof materialTypeData === "undefined") return;
    formIntance.setFieldsValue(materialTypeData);
  }, [materialTypeData]);

  const onFinish = async (values: TSaveMaterialTypeForm) => {
    try {
      const user = sessionData?.user;

      if (typeof user === "undefined") throw new Error("Sesión vencida");

      setIsLoading(true);

      const predefinedFields: Array<TFields> = values.predefinedFields.map(
        (field) => ({
          name: field,
          fieldType: "default",
        }),
      );
      const customFields: Array<TFields> = values.customFields
        ? values.customFields.map((field) => ({
            name: field.name,
            fieldType: JSON.parse(field.fieldType).fieldType,
            fieldList: Array.isArray(field.fieldList)
              ? field.fieldList?.join(";")
              : undefined,
          }))
        : [];
      const valuesToSend: TSaveMaterialType = {
        name: values.name,
        fields: predefinedFields.concat(customFields),
      };
      console.log("values: ", valuesToSend);
      // if (!!materialTypeData) {
      //   await updateMaterialType(materialTypeData.id, values, user.token);
      // } else {
      //   await createMaterialType(values, user.token);
      // }

      openNotification(
        "success",
        "Laboratorio guardado con exito",
        `El tipo de material ${values.name} ha sido creado con exito.`,
        "topRight",
      );
      //callback();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log("ERROR: ", error);
      if (error.message.includes("MaterialType place already exists")) {
        openNotification(
          "error",
          "El identificador ya existe",
          "Ingrese otro número de identificador",
          "topRight",
        );
      } else {
        openNotification(
          "error",
          "Ha ocurrido un error al guardar el tipo de material",
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
