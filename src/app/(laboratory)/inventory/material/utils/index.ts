import type { TDefaultMaterialFields } from "../../materialType/interfaces";

export const variableFields: Array<TDefaultMaterialFields> = [
  {
    id: "measurement",
    label: "Unidad de medida",
  },
  {
    id: "presentation",
    label: "Presentación",
  },
  {
    id: "capacity",
    label: "Capacidad",
  },
  {
    id: "weight",
    label: "Peso",
  },
  {
    id: "quantity",
    label: "Cantidad",
  },
  {
    id: "brand",
    label: "Marca",
  },
  {
    id: "code",
    label: "Código",
  },
  {
    id: "batch",
    label: "Lote",
  },
  {
    id: "concentration",
    label: "Concentración",
  },
  {
    id: "expirationDate",
    label: "Fecha de Vencimiento",
  },
  {
    id: "condition",
    label: "Condición",
  },
  {
    id: "storagePlace",
    label: "Lugar de almacenamiento",
  },
  {
    id: "sensibleMaterial",
    label: "Material sensible",
  },
  {
    id: "superUse",
    label: "Necesita supervisión",
  },
  {
    id: "additionalInfo",
    label: "Información Adicional",
  },
  {
    id: "observations",
    label: "Observaciones",
  },
  {
    id: "nfpaClassif",
    label: "Clasificación NFPA",
  },
  {
    id: "sgaClassif",
    label: "Clasificación SGA",
  },
];

export const baseFields: Array<TDefaultMaterialFields> = [
  {
    id: "id",
    label: "#",
  },
  {
    id: "name",
    label: "Nombre",
  },
  {
    id: "description",
    label: "Descripción",
  },
  {
    id: "materialType",
    label: "Tipo de material",
  },
];

const notListedFieldsId = [
  "measurement",
  "additionalInfo",
  "observations",
  "nfpaClassif",
  "sgaClassif",
];

export const fieldsToList = baseFields
  .concat(variableFields)
  .filter((field) => !notListedFieldsId.includes(field.id));

export const isoDateRegex =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})?$/;
