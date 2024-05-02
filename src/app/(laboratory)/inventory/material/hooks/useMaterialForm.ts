import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { FormInstance } from "antd/lib";
import useNotification from "@/hooks/useNotification";
import { Routes } from "@/lib/constants";
import { createMaterial } from "../../utils";
import { variableFields } from "../utils";
import type { TMaterialForm, TMaterialType } from "../../interfaces";
import useMaterialInit from "./useMaterialInit";

export default function useMaterialForm (formIntance: FormInstance) {
  const [currentMeasurement, setCurrentMeasurement] = useState<string>("");
  const [currentMaterialType, setCurrentMaterialType] = useState<TMaterialType>();
  const { openNotification, notificationElement } = useNotification();
  const { data: sessionData } = useSession();
  const {
    materialTypeList,
    measurementList,
    sgaClassification,
  } = useMaterialInit()
  const router = useRouter();

  useEffect(() => {
    if (typeof currentMaterialType === "undefined") return;
    formIntance.resetFields(variableFields.map((field) => field.id));
  }, [currentMaterialType]);

  const handleCurrentMeasurement = (value: string) => {
    setCurrentMeasurement(value);
  };

  const onFinish = async (values: TMaterialForm) => {
    try {
      const {
        nfpaBlue,
        nfpaRed,
        nfpaWhite,
        nfpaYellow,
        materialType,
        measurement,
        storagePlace,
        sgaClassif,
        weight,
        ...fieldValues
      } = values;
      const materialTypeParsed = JSON.parse(materialType) as TMaterialType;

      await createMaterial({
        nfpaClassif: {
          nfpaBlue,
          nfpaRed,
          nfpaWhite,
          nfpaYellow,
        },
        materialType: {
          id: materialTypeParsed.id
        },
        measurement: {
          id: measurement,
        },
        storagePlace: {
          id: storagePlace,
        },
        sgaClassif: sgaClassif.map(sga => ({ idSgaClassif: sga })),
        weight: weight?.toString(),
        ...fieldValues,
      }, sessionData?.user.token ?? "");
      openNotification(
        "success",
        "Material creado con exito",
        `El material ${values.name} ha sido creado con exito.`,
        "topRight"
      );
      void router.push(Routes.Inventory);
    } catch (error) {
      openNotification("error", "Ha ocurrido un error al guardar el material", "", "topRight");
      console.log("ERROR: ", error);
    }
  };

  const hasField = (field: string) => {
    if (typeof currentMaterialType === "undefined") return false;
    const availableFields = currentMaterialType.fields.split(";");
    return availableFields.includes(field);
  };

  return {
    currentMaterialType,
    currentMeasurement,
    measurementList,
    materialTypeList,
    notificationElement,
    sgaClassification,
    handleCurrentMeasurement,
    hasField,
    onFinish,
    setCurrentMaterialType,
  }
};