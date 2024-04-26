import { useEffect, useState } from "react";
import { getMaterialTypes, getMeasurements, getSGAClassification } from "../../utils";
import type { TMaterialType, TMeasurements, TSGAClassification } from "../../interfaces";

export default function useMaterialInit () {
  const [measurementList, setMeasurementList] = useState<Array<TMeasurements>>([]);
  const [materialTypeList, setMaterialTypeList] = useState<Array<TMaterialType>>([]);
  const [sgaClassification, setSgaClassification] = useState<Array<TSGAClassification>>([]);

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

  return {
    measurementList,
    materialTypeList,
    sgaClassification,
  };
};