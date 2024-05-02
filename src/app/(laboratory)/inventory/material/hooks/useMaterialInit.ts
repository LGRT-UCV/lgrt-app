import { useEffect, useState } from "react";
import { getMaterialTypes, getMeasurements, getSGAClassification, getStoragePlaces } from "../../utils";
import type { TMaterialType, TMeasurements, TSGAClassification, TStoragePlace } from "../../interfaces";

export default function useMaterialInit () {
  const [measurementList, setMeasurementList] = useState<Array<TMeasurements>>([]);
  const [materialTypeList, setMaterialTypeList] = useState<Array<TMaterialType>>([]);
  const [sgaClassification, setSgaClassification] = useState<Array<TSGAClassification>>([]);
  const [storagePlace, setStoragePlace] = useState<Array<TStoragePlace>>([]);

  useEffect(() => {
    const getFormData = async () => {
      const measurementsResponse: TMeasurements[] = await getMeasurements();
      const materialTypeResponse: TMaterialType[] = await getMaterialTypes();
      const sgaResponse: TSGAClassification[] = await getSGAClassification();
      const storageResponse: TStoragePlace[] = await getStoragePlaces();
      setMeasurementList(measurementsResponse);
      setMaterialTypeList(materialTypeResponse);
      setSgaClassification(sgaResponse);
      setStoragePlace(storageResponse);
    };

    void getFormData();
  }, []);

  return {
    measurementList,
    materialTypeList,
    sgaClassification,
    storagePlace,
  };
};