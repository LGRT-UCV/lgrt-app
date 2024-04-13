import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { FormInstance } from "antd/lib";
import useNotification from "@/hooks/useNotification";
import { Routes } from "@/lib/constants";
import { createMaterial, getMaterialTypes, getMeasurements, getSGAClassification } from "../../utils";
import { variableFields } from "../utils";
import type {
  TMaterialForm,
  TMaterialType,
  TMeasurements,
  TSGAClassification
} from "../../interfaces";

export default function useMaterialForm (formIntance: FormInstance) {
  const [measurementList, setMeasurementList] = useState<Array<TMeasurements>>([]);
  const [materialTypeList, setMaterialTypeList] = useState<Array<TMaterialType>>([]);
  const [sgaClassification, setSgaClassification] = useState<Array<TSGAClassification>>([]);
  const [currentMeasurement, setCurrentMeasurement] = useState<string>("");
  const [currentMaterialType, setCurrentMaterialType] = useState<TMaterialType>();
  const { openNotification, notificationElement } = useNotification();
  const router = useRouter();
  const { data: sessionData } = useSession();

  useEffect(() => {
    const getFormData = async () => {
      const measurementsResponse: TMeasurements[] = await getMeasurements();
      const materialTypeResponse: TMaterialType[] = await getMaterialTypes();
      const sgaResponse: TSGAClassification[] = await getSGAClassification();
      setMeasurementList(measurementsResponse);
      setMaterialTypeList(materialTypeResponse);
      setSgaClassification(sgaResponse);
    };

    void getFormData();
  }, []);

  useEffect(() => {
    if (typeof currentMaterialType === "undefined") return;
    formIntance.resetFields(variableFields);
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
        sgaClassif,
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
        materialType: materialTypeParsed.id,
        sgaClassif: sgaClassif.map(sga => ({ idSgaClassif: sga })),
        ...fieldValues,
      }, sessionData?.user.token ?? "");
      //router.push(Routes.Inventory);
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