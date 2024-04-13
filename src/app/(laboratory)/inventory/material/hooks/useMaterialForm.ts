import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { FormInstance } from "antd/lib";
import useNotification from "@/hooks/useNotification";
import { Routes } from "@/lib/constants";
import { getMaterialTypes, getMeasurements, getSGAClassification } from "../../utils";
import { variableFields } from "../utils";
import type { TMaterialType, TMeasurements, TSGAClassification } from "../../interfaces";

export default function useMaterialForm (formIntance: FormInstance) {
  const [measurementList, setMeasurementList] = useState<Array<TMeasurements>>([]);
  const [materialTypeList, setMaterialTypeList] = useState<Array<TMaterialType>>([]);
  const [sgaClassification, setSgaClassification] = useState<Array<TSGAClassification>>([]);
  const [currentMeasurement, setCurrentMeasurement] = useState<string>("");
  const [currentMaterialType, setCurrentMaterialType] = useState<TMaterialType>();
  const { openNotification, notificationElement } = useNotification();
  const router = useRouter();

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

  const onFinish = async (values: any) => {
    try {
      console.log("Values", values)
    } catch (error) {
      openNotification("error", "Ha ocurrido un error al guardar el elemento", "", "topRight");
      console.log("ERROR: ", error);
    }

    //router.push(Routes.Inventory);
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