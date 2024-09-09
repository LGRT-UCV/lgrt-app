import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { FormInstance } from "antd/lib";
import dayjs from "dayjs";
import useNotification from "@/hooks/useNotification";
import { Routes } from "@/lib/constants";
import { createMaterial, updateMaterial } from "../../utils";
import type { TMaterial, TMaterialForm, TMaterialType } from "../../interfaces";
import { TDefaultMaterialFields } from "../../materialType/interfaces";

interface FieldFinalValues {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export default function useMaterialForm(
  formIntance: FormInstance,
  materialData?: TMaterial,
) {
  const [currentMeasurement, setCurrentMeasurement] = useState<string>("");
  const [currentMaterialType, setCurrentMaterialType] =
    useState<TMaterialType>();
  const { openNotification, notificationElement } = useNotification();
  const { data: sessionData } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (
      typeof materialData === "undefined" ||
      typeof formIntance === "undefined"
    )
      return;

    const {
      measurement,
      materialType,
      storagePlace,
      sgaClassif,
      nfpaClassif,
      expirationDate,
      customFieldValues,
      ...material
    } = materialData;
    const isoDateRegex =
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})?$/;

    const customFields = (customFieldValues ?? []).reduce((acc, field) => {
      if (isoDateRegex.test(field.value)) {
        acc[`custom-${field.idMaterialField}`] = dayjs(field.value);
      } else {
        acc[`custom-${field.idMaterialField}`] = field.value;
      }
      return acc;
    }, {} as FieldFinalValues);

    const fieldData = {
      measurement: measurement.id,
      materialType: materialType.id,
      storagePlace: storagePlace.id,
      sgaClassif: sgaClassif.map((sga) => sga?.idSgaClassif ?? ""),
      expirationDate: dayjs(expirationDate),
      ...nfpaClassif,
      ...customFields,
      ...material,
    };

    formIntance.setFieldsValue(fieldData);
    setCurrentMaterialType(materialType);
    handleCurrentMeasurement(
      `${measurement.description} (${measurement.name})`,
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

      // Get custom fields and generate customFieldValues
      const customFieldValues = Object.entries(fieldValues)
        .filter(([key]) => key.startsWith("custom-"))
        .map(([key, value]) => {
          const idMaterialField = key.split("-")[1];
          return {
            idMaterialField,
            value,
          };
        });

      // Remove custom fields from fieldValues
      const fieldFinalValues: FieldFinalValues = Object.entries(fieldValues)
        .filter(([key]) => !key.startsWith("custom-"))
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {} as FieldFinalValues);

      const materialToSave = {
        nfpaClassif: {
          nfpaBlue,
          nfpaRed,
          nfpaWhite,
          nfpaYellow,
        },
        materialType: {
          id: materialType,
        },
        measurement: {
          id: measurement,
        },
        storagePlace: {
          id: storagePlace,
        },
        sgaClassif: sgaClassif?.map((sga) => ({ idSgaClassif: sga })) ?? [],
        weight: weight?.toString(),
        superUse: !!superUse,
        sensibleMaterial: !!sensibleMaterial,
        customFieldValues,
        ...fieldFinalValues,
      };
      const sessionToken = sessionData?.user.token;

      console.log("materialToSave: ", materialToSave);

      if (typeof sessionToken === "undefined")
        throw new Error("Sesión vencida");

      // if (!!materialData) {
      //   await updateMaterial(materialData.id, materialToSave, sessionToken);
      // } else {
      //   await createMaterial(materialToSave, sessionToken);
      // }

      openNotification(
        "success",
        "Material guardado con exito",
        `El material ${values.name} ha sido creado con exito.`,
        "topRight",
      );
      //void router.push(Routes.Inventory);
    } catch (error) {
      openNotification(
        "error",
        "Ha ocurrido un error al guardar el material",
        "",
        "topRight",
      );
      console.error("ERROR: ", error);
    }
  };

  const hasField = (field: TDefaultMaterialFields["id"]) => {
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
  };
}
