import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { FormInstance } from "antd/lib";
import useNotification from "@/hooks/useNotification";
import { Routes } from "@/lib/constants";
import { createMaterial, updateMaterial } from "../../utils";
import type { TMaterial, TMaterialForm, TMaterialType } from "../../interfaces";

export default function useMaterialForm (formIntance: FormInstance, materialData?: TMaterial) {
  const [currentMeasurement, setCurrentMeasurement] = useState<string>("");
  const [currentMaterialType, setCurrentMaterialType] = useState<TMaterialType>();
  const { openNotification, notificationElement } = useNotification();
  const { data: sessionData } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (
      typeof materialData === "undefined" ||
      typeof formIntance === "undefined"
    ) return;
    
    const {
      measurement,
      materialType,
      storagePlace,
      sgaClassif,
      nfpaClassif,
      ...material
    } = materialData;

    const fieldData: TMaterialForm = {
      measurement: measurement.id,
      materialType: JSON.stringify(materialType),
      storagePlace: storagePlace.id,
      sgaClassif: sgaClassif.map((sga) => (sga?.idSgaClassif ?? "")),
      ...nfpaClassif,
      ...material,
    };

    formIntance.setFieldsValue(fieldData);
    setCurrentMaterialType(materialType);
    handleCurrentMeasurement(
      `${measurement.description} (${measurement.name})`
    );
  }, [materialData]);

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
        superUse,
        sensibleMaterial,
        ...fieldValues
      } = values;
      const materialTypeParsed = JSON.parse(materialType) as TMaterialType;
      const materialToSave = {
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
        superUse: !!superUse,
        sensibleMaterial: !!sensibleMaterial,
        ...fieldValues,
      };
      const sessionToken = sessionData?.user.token;

      if (typeof sessionToken === "undefined") throw new Error("Sesión vencida");

      if (!!materialData) {
        await updateMaterial(materialData.id, materialToSave, sessionToken);
      } else {
        await createMaterial(materialToSave, sessionToken);
      }

      openNotification(
        "success",
        "Material guardado con exito",
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
    notificationElement,
    handleCurrentMeasurement,
    hasField,
    onFinish,
    setCurrentMaterialType,
  }
};