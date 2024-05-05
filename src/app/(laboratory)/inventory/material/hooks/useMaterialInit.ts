import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMaterialTypes, getMeasurements, getSGAClassification, getStoragePlaces } from "../../utils";
import type { TMaterialType, TMeasurements, TSGAClassification, TStoragePlace } from "../../interfaces";

type TRequestMaterialInit = "measurements" | "materialType" | "sgaClassification" | "storagePlace";

export default function useMaterialInit (request?: Array<TRequestMaterialInit>) {
  const isFilteringAll = useMemo(() => {
    return typeof request === "undefined" || request.length === 0;
  }, [request]);

  const {
    data: measurementList = [],
    isLoading: isMeasurementsLoading,
  } = useQuery({
    queryKey: ["measurements"],
    queryFn: async () => {
        return await getMeasurements();
    },
    enabled: isFilteringAll || request?.includes("measurements"),
  });

  const {
    data: materialTypeList = [],
    isLoading: isMaterialTypeLoading,
  } = useQuery({
    queryKey: ["materialType"],
    queryFn: async () => {
        return await getMaterialTypes();
    },
    enabled: isFilteringAll || request?.includes("materialType"),
  });

  const {
    data: sgaClassification = [],
    isLoading: isSgaClassLoading,
  } = useQuery({
    queryKey: ["sgaClassification"],
    queryFn: async () => {
        return await getSGAClassification();
    },
    enabled: isFilteringAll || request?.includes("sgaClassification"),
  });

  const {
    data: storagePlace = [],
    isLoading: isStoragePlaceLoading,
  } = useQuery({
    queryKey: ["storagePlace"],
    queryFn: async () => {
        return await getStoragePlaces();
    },
    enabled: isFilteringAll || request?.includes("storagePlace"),
  });

  return {
    measurementList,
    materialTypeList,
    sgaClassification,
    storagePlace,
    isLoading:
      isMeasurementsLoading ||
      isMaterialTypeLoading ||
      isSgaClassLoading ||
      isStoragePlaceLoading,
  };
};